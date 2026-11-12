#!/usr/bin/env python3
"""Validate raw research for staging; separate publication checks still apply."""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import math
import re
import sys
from collections import Counter
from pathlib import Path


REQUIRED_COLUMNS = {
    "provider",
    "plan_name",
    "plan_slug",
    "ram_gb",
    "vcpus",
    "disk_gb",
    "locations",
    "effective_monthly_usd",
    "currency",
    "official_url",
    "checked_date",
}

IDENTITY_COLUMNS = ("provider", "plan_name", "plan_slug", "official_url", "checked_date")
NUMERIC_COLUMNS = (
    "ram_gb",
    "vcpus",
    "disk_gb",
    "bandwidth_tb",
    "term_months",
    "price_hourly_usd",
    "price_monthly_usd",
    "price_yearly_usd",
    "effective_monthly_usd",
    "trustpilot_score",
    "trustpilot_reviews",
)
AFFILIATE_COLUMNS = (
    "affiliate_status",
    "affiliate_url",
    "affiliate_network",
    "commission",
    "affiliate_checked_date",
)


def empty(value: str | None) -> bool:
    return not (value or "").strip()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("csv_path", type=Path)
    args = parser.parse_args()

    if not args.csv_path.exists():
        print(f"ERROR file does not exist: {args.csv_path}")
        return 1

    with args.csv_path.open(newline="", encoding="utf-8-sig") as handle:
        reader = csv.DictReader(handle)
        rows = list(reader)
        columns = reader.fieldnames or []

    errors: list[str] = []
    warnings: list[str] = []
    samples: list[str] = []

    missing_columns = sorted(REQUIRED_COLUMNS - set(columns))
    if missing_columns:
        errors.append(f"missing required columns: {', '.join(missing_columns)}")

    for row_number, row in enumerate(rows, start=2):
        for column in IDENTITY_COLUMNS:
            if column in columns and empty(row.get(column)):
                errors.append(f"row {row_number}: required {column} is empty")

        effective = (row.get("effective_monthly_usd") or "").strip()
        if not effective:
            warnings.append(
                f"row {row_number}: effective_monthly_usd is empty; raw staging only, non-publishable until a price is researched"
            )

        for column in NUMERIC_COLUMNS:
            value = (row.get(column) or "").strip()
            if not value:
                continue
            try:
                parsed = float(value)
            except ValueError:
                errors.append(f"row {row_number}: {column} is not numeric ({value!r})")
                continue
            if not math.isfinite(parsed):
                errors.append(f"row {row_number}: {column} is not finite ({value})")
            elif parsed < 0:
                errors.append(f"row {row_number}: {column} is negative ({value})")

        url = (row.get("official_url") or "").strip()
        if url and not re.match(r"^https?://", url):
            errors.append(f"row {row_number}: official_url is invalid")

        checked = (row.get("checked_date") or "").strip()
        if checked:
            try:
                dt.date.fromisoformat(checked)
            except ValueError:
                errors.append(f"row {row_number}: checked_date is not YYYY-MM-DD")

    keys = Counter(
        ((row.get("provider") or "").strip().casefold(), (row.get("plan_slug") or "").strip().casefold())
        for row in rows
    )
    duplicate_keys = [key for key, count in keys.items() if count > 1]
    if duplicate_keys:
        errors.append(f"{len(duplicate_keys)} duplicate provider + plan_slug keys")
        samples.extend(f"duplicate key: {provider}/{slug}" for provider, slug in duplicate_keys[:5])

    allowed_sparse = {
        "ram_gb": "Some dedicated, PaaS, or from-price rows do not publish RAM.",
        "vcpus": "Some dedicated, PaaS, or from-price rows do not publish vCPU.",
        "disk_gb": "Some compute products price disk separately.",
        "bandwidth_tb": "Many providers publish transfer as unmetered or location-dependent text.",
        "trustpilot_score": "Some providers have no reliable Trustpilot snapshot.",
    }
    for column, reason in allowed_sparse.items():
        if column not in columns:
            continue
        missing = sum(empty(row.get(column)) for row in rows)
        if missing:
            warnings.append(f"{column}: {missing}/{len(rows)} empty. {reason}")

    missing_affiliate = [column for column in AFFILIATE_COLUMNS if column not in columns]
    if missing_affiliate:
        warnings.append(
            "affiliate fields are not in the offer CSV; import provider affiliate research into a separate provider_affiliates table"
        )

    providers = {row.get("provider", "").strip() for row in rows if not empty(row.get("provider"))}
    currencies = Counter(row.get("currency", "").strip() for row in rows)
    dates = sorted({row.get("checked_date", "").strip() for row in rows if not empty(row.get("checked_date"))})

    print(f"Dataset: {args.csv_path}")
    print(f"Grain: one researched provider plan per provider + plan_slug")
    print(f"Rows: {len(rows)} | Columns: {len(columns)} | Providers: {len(providers)}")
    print(f"Currencies: {dict(currencies)}")
    print(f"Checked dates: {dates[0] if dates else 'none'} to {dates[-1] if dates else 'none'}")
    print(f"Errors: {len(errors)} | Warnings: {len(warnings)}")

    for message in errors[:20]:
        print(f"ERROR {message}")
    if len(errors) > 20:
        print(f"ERROR ... {len(errors) - 20} additional errors")
    for message in warnings:
        print(f"WARN  {message}")
    for message in samples:
        print(f"INFO  {message}")

    if errors:
        print("RESULT blocked: fix errors or explicitly stage affected rows as non-publishable")
        return 1

    print("RESULT pass: raw research can be staged; publication checks still apply")
    return 0


if __name__ == "__main__":
    sys.exit(main())
