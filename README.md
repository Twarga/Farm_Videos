# Farm_Videos

Monorepo mirroring the video-farm working folders on tlab (192.168.100.26).

| Subdir | Source | What it is |
|---|---|---|
| `videofarm/` | `~/videofarm` | **Active farm**: subject+title+style → 1080p long video, 3 Shorts, thumbnail, YouTube metadata. Web UI :8686 (tmux `farmweb`). |
| `rickcklipsclone/` | `~/rickcklipsclone` | Clipper: slices existing videos into shorts. |
| `infographics_Videos/` | `~/infographics_Videos` | Older prototype (superseded by videofarm). |
| `oday/` | `~/oday` | Oday factory/analysis. |
| `film-work/` | `~/film-work` | Film experiments (dormant). |

**Sync:** `~/Farm_Videos_sync.sh` runs every 5 min via cron + `@reboot`; rsync-mirrors live folders → here → commit+push as Twarga. Only code/config/text is synced — venvs, node_modules, rendered media (*.mp4/*.wav/images), and files >25 MB are excluded (see `~/sync_exclude.txt`). The live folders stay where they are; the farm service is unaffected.
