# Owner Items: Batch b04-eu-mid

Date: 2026-11-01
Batch: `b04-eu-mid`
Providers: Scaleway, UpCloud, Contabo, Leaseweb, Cherry Servers, Atlantic.net

## BLOCKED Providers & Pages
- **Atlantic.net (`https://www.atlantic.net/`, `https://www.atlantic.net/cloud-hosting/pricing/`, `https://www.atlantic.net/vps-hosting/windows-vps-hosting/`, `https://www.atlantic.net/cloud-platform/best-cloud-hosting-providers-small-businesses/`)**: Completely BLOCKED with HTTP 403 on automated requests (Cloudflare / bot management). Per research contract rule 2, access was not bypassed and zero rows were emitted for Atlantic.net. The 6 historical plans (`g3-2gb-linux`, `g3-2gb-win`, `g3-4gb-win`, `g3-8gb-win`, `g3-16gb-win`, `g3-32gb-win`) are held pending manual review or unblocking.
- **Trustpilot (`https://www.trustpilot.com/review/<domain>`)**: All 6 assigned domains (`scaleway.com`, `upcloud.com`, `contabo.com`, `leaseweb.com`, `cherryservers.com`, `atlantic.net`) returned HTTP 403 due to Cloudflare anti-bot challenges on Trustpilot. Per research contract rule 4, `trustpilot_score`, `trustpilot_reviews`, and `trustpilot_url` are left blank across all rows.

## Pricing & Plan Notes / Ambiguities Resolved
- **Contabo (Cloud VPS)**: The public VPS landing page (`https://contabo.com/en/vps/`) shows dual pricing (e.g. €5.50 and €4.40) adjacent to an "Including VAT / Excluding VAT" toggle and a footnote reading "for the first 24 months". Testing the official order configurator (`https://contabo.com/en/vps/cloud-vps-core-4`) clarifies this structure:
  - 1-Month commitment: €5.50/mo (No Setup Fee).
  - 12-Month commitment: €4.68/mo (-15%, No Setup Fee).
  - 24-Month commitment: €4.40/mo (-20%, No Setup Fee).
  The CSV emits the verified 1-month commitment price with no setup fee (€5.50, €7.50, €14.00, €25.00, €37.00, €49.00), and records the multi-month discounted rates in `billing_notes`.
- **Scaleway (Virtual Instances)**:
  - Storage (local NVMe/block) and public IPv4 (Flexible IP) are unbundled and billed separately; list price includes egress traffic and IPv6 address.
  - Development instances (STARDUST, DEV1, PLAY2) and General Purpose dedicated instances (PRO2, GP1) are verified against the current pricing table.
  - Expanded the General Purpose BASIC3 shared range from the previous 4 SKUs to all 12 published SKUs (up to BASIC3-X16C-64G), keeping `basic3-x*` slugs consistent.
- **UpCloud (Cloud Servers)**:
  - Re-verified all 9 Starter plans (capped at 28 days = 672h/month).
  - Corrected `disk_type` from stale "MaxIOPS" to "Standard SSD" based on official product specifications ("Standard performance SSD storage").
  - Added 12 fixed-configuration Premium Cloud Server plans (combining AMD EPYC processors and bundled MaxIOPS storage, 1000 Mbps bandwidth, and included IPv4).
- **Leaseweb (VPS / Public Cloud)**:
  - The main marketing VPS page (`https://www.leaseweb.com/en/products-services/cloud/virtual-private-server`) is a client-side Angular SPA querying an internal shop API.
  - Active prices (effective for all new contracts from 1 August 2026) were verified via Leaseweb's official announcement (`https://blog.leaseweb.com/2026/07/28/vps-price-increases-are-coming-for-new-contracts-in-2026/`).
  - Full hardware specifications (vCPU, RAM, NVMe storage, and 30 TB Volume network bandwidth) were verified directly from Leaseweb's official Developer Ordering API documentation (`https://developer.leaseweb.com/docs/`), fully resolving the previous "UNVERIFIED" status for VPS 4 and VPS 6.
  - Emitted all 6 tiers for European DCs (AMS, FRA in EUR) and all 6 tiers for US DCs (WDC, SFO, LAX in USD).
- **Cherry Servers (VPS only)**:
  - The public pricing page (`https://www.cherryservers.com/pricing/virtual-servers`) uses client-side rendering, but the official public REST API (`https://api.cherryservers.com/v1/plans`) provides exact specifications and pricing.
  - Emitted all 4 Cloud VPS Gen 2 plans (Cloud VPS 1, 2, 4, 6) and 4 Storage VPS plans (Storage VPS 2, 4, 6, 8) with KVM virtualization and 1 Gbps uplink.

## Vanished Plans
- **Cherry Servers `virtual-from`**: The previous dataset contained a synthetic placeholder `virtual-from` ("Virtual Server (from)") reflecting marketing text "$0.018/hr" without RAM, vCPU, or disk specs. This placeholder has been dropped in favor of the concrete Cloud VPS Gen 2 and Storage VPS plan rows.
- **Atlantic.net plans**: All 6 historical plans (`g3-2gb-linux`, `g3-2gb-win`, `g3-4gb-win`, `g3-8gb-win`, `g3-16gb-win`, `g3-32gb-win`) could not be re-verified due to automated 403 blocks and are omitted from this batch pending manual owner review.

## Provider Identity Facts
- All 6 assigned providers (Scaleway, UpCloud, Contabo, Leaseweb, Cherry Servers, Atlantic.net) are existing providers previously tracked in `data/vps-offers-2026-08-31.csv`.
