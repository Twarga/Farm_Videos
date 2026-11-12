"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ButtonHTMLAttributes, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { ShoreIcon } from "./ShoreIcon";

export function ShoreButton({ primary = false, className = "", type = "button", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { primary?: boolean }) { return <button type={type} className={`btn${primary ? " btn--primary" : ""}${className ? " " + className : ""}`} {...props} />; }

export function ShorePill({ className = "", type = "button", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) { return <button type={type} className={`pill${className ? " " + className : ""}`} {...props} />; }

export function Segmented<T extends string | number>({ label, options, value, onChange, className = "" }: { label: string; options: readonly { value: T; label: ReactNode }[]; value: T; onChange: (value: T) => void; className?: string }) {
  return <div className={`seg${className ? " " + className : ""}`} role="group" aria-label={label}>{options.map(option => <button key={option.value} type="button" aria-pressed={option.value === value} onClick={() => onChange(option.value)}>{option.label}</button>)}</div>;
}

export function Toggle({ label, checked, onChange, disabled = false }: { label: string; checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean }) {
  return <label className="tgl"><input type="checkbox" role="switch" checked={checked} disabled={disabled} onChange={event => onChange(event.currentTarget.checked)} /><span className="tgl__t" aria-hidden="true"/><span>{label}</span></label>;
}

export function Checkbox({ label, checked, onChange, count, value, disabled = false }: { label: string; checked: boolean; onChange: (checked: boolean) => void; count?: number; value?: string; disabled?: boolean }) {
  return <label className="ck"><input type="checkbox" value={value} checked={checked} disabled={disabled} onChange={event => onChange(event.currentTarget.checked)}/><span className="ck__box" aria-hidden="true"><ShoreIcon name="check" /></span><span className="ck__l">{label}</span>{count != null ? <span className="ck__n num">{count}</span> : null}</label>;
}

export function RangeFilter({ id, label, icon, steps, value, text, endpoint, onChange }: { id: string; label: string; icon: string; steps: readonly (number | null)[]; value: number | null; text: (value: number | null) => string; endpoint: (value: number | null) => string; onChange: (value: number | null) => void }) {
  const index = Math.max(0, steps.indexOf(value));
  return <div className="fl fl--rng" data-k={id}><div className="fl__h"><label htmlFor={`r-${id}`}><ShoreIcon name={icon}/>{label}</label><output id={`o-${id}`} htmlFor={`r-${id}`}>{text(value)}</output></div><input className="rng" type="range" id={`r-${id}`} min={0} max={Math.max(0, steps.length - 1)} step={1} value={index} aria-valuetext={text(value)} onChange={event => onChange(steps[Number(event.currentTarget.value)])} style={{ "--p": `${index / Math.max(1, steps.length - 1) * 100}%` } as CSSProperties}/><div className="rng__ends" aria-hidden="true"><span>{endpoint(steps[0])}</span><span>{endpoint(steps[steps.length - 1])}</span></div></div>;
}

export type DropdownOption = { value: string; label: string };
export function Dropdown({ id, label, name, value, options, onChange, small = false }: { id: string; label: string; name?: string; value: string; options: readonly DropdownOption[]; onChange: (value: string) => void; small?: boolean }) {
  const [enhanced, setEnhanced] = useState(false);
  const [open, setOpen] = useState(false);
  const [up, setUp] = useState(false);
  const [active, setActive] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const index = Math.max(0, options.findIndex(option => option.value === value));
  const buttonId = id + "-button";
  const listId = id + "-list";
  useEffect(() => {
    setEnhanced(true);
    const element = document.querySelector<HTMLLabelElement>(`label[for="${CSS.escape(id)}"]`);
    if (element) element.htmlFor = buttonId;
    return () => { if (element) element.htmlFor = id; };
  }, [id, buttonId]);
  useLayoutEffect(() => {
    if (!open || !list.current || !button.current) return;
    const rect = button.current.getBoundingClientRect();
    setUp(innerHeight - rect.bottom < Math.min(list.current.scrollHeight, 300) + 16 && rect.top > innerHeight - rect.bottom);
    list.current.focus({ preventScroll: true });
  }, [open]);
  useEffect(() => {
    if (!open) return;
    list.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active, open]);
  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => { if (!wrap.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);
  function close(focus = true) { setOpen(false); if (focus) button.current?.focus(); }
  function pick(position: number) { const option = options[position]; if (option && option.value !== value) onChange(option.value); close(); }
  function move(position: number) { if (options.length) setActive((position + options.length) % options.length); }
  function show(offset = 0) { move(index + offset); setOpen(true); }
  function keydown(event: KeyboardEvent<HTMLUListElement>) {
    const key = event.key;
    if (key === "ArrowDown") move(active + 1);
    else if (key === "ArrowUp") move(active - 1);
    else if (key === "Home") move(0);
    else if (key === "End") move(options.length - 1);
    else if (key === "Enter" || key === " ") pick(active);
    else if (key === "Escape") close();
    else if (key === "Tab") { close(false); return; }
    else if (key.length === 1) { const matches = options.map((option, i) => ({ ...option, i })).filter(option => option.label.toLowerCase().startsWith(key.toLowerCase())); const match = matches.find(option => option.i > active) ?? matches[0]; if (match) move(match.i); return; }
    else return;
    event.preventDefault();
  }
  return <div className={`dd${small ? " dd--sm" : ""}${open ? " open" : ""}${up && open ? " up" : ""}`} ref={wrap} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) close(false); }}>
    {enhanced ? <button ref={button} id={buttonId} type="button" className={`select${small ? " select--sm" : ""} dd__btn`} aria-label={`${label}: ${options[index]?.label ?? ""}`} aria-haspopup="listbox" aria-expanded={open} aria-controls={listId} disabled={!options.length} onClick={() => open ? close() : show()} onKeyDown={event => { if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) { event.preventDefault(); show(event.key === "ArrowUp" ? -1 : 0); } }}><span className="dd__v">{options[index]?.label}</span></button> : null}
    <ul ref={list} id={listId} className="dd__list" role="listbox" tabIndex={-1} aria-label={label} hidden={!open} aria-activedescendant={open ? `${id}-option-${active}` : undefined} onKeyDown={keydown}>{options.map((option, i) => <li key={option.value} id={`${id}-option-${i}`} role="option" data-index={i} aria-selected={option.value === value} className={active === i ? "act" : undefined} onClick={event => { event.preventDefault(); pick(i); }} onPointerMove={() => setActive(i)}><span>{option.label}</span><ShoreIcon name="check"/></li>)}</ul>
    <select className={`select${small ? " select--sm" : ""}`} id={id} name={name} value={value} aria-label={label} hidden={enhanced} tabIndex={enhanced ? -1 : undefined} onChange={event => onChange(event.currentTarget.value)}>{options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
  </div>;
}
