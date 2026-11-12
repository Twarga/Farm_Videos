# Master Resource: AI infographic YouTube channel + Claude Code video tool

Compiled 2026-11-08. Everything below was read during research. Items marked `[INFERENCE]` were not verified.
Related: skill at `~/.claude/skills/youtube-infographic-business/`.

## 0. Reference channel: @arinfographics (إنفوجرافيك عربي)

Data: `videos/arinfographics-channel-videos.json` (yt-dlp flat metadata, 200 videos, no video files).

- Language/dialect: Arabic, Moroccan focus. Titles mix Modern Standard Arabic and Darija ("شنو مخبي", "غادي", "كيفاش").
- Subscribers: ~137,000. Videos sampled: 200. Median views 35,000, max 1.2M, min 420. Average duration ~14 min.
- Format: news-driven geopolitics/economy/infrastructure explainers (military, ports, water, rail, budget law, Western Sahara).

Top 10 by views (id in brackets):
| Views | Min | Title |
|---|---|---|
| 1.2M | 20 | المينورسو تغادر الصحراء و المغرب يفاجئ الجميع… 5 سيناريوهات [09kFmNv6V1I] |
| 761K | 13 | معجزة الجدار الرملي: كيفاش بنا المغرب ثاني أطول حزام أمني [IqEfvY1n1LQ] |
| 684K | 23 | ميناء الناظور غرب المتوسط: لماذا تتسابق أكبر شركات الشحن إليه [jaE0AcETfA4] |
| 674K | 11 | المغرب يكسر احتكار إسبانيا... أحواض السفن [iWbZ9yHU9Es] |
| 663K | 20 | شنو مخبي قانون المالية 2027 للمغاربة؟ [JcGzO2VD6YA] |
| 621K | 14 | الحكومة غادي تحارب الشناقة.. كيفاش؟ [0eE2UCY5hWY] |
| 562K | 5 | شرح الفرق بين العامل والباشا والقائد بالمغرب [RIkp4ezHHDQ] |
| 548K | 13 | أضخم مشروع سككي: ONCF والبراق [oNeOCTKxmBg] |
| 511K | 6 | لماذا أخرجت موريتانيا ورقة الحدود الآن.. الكويرة [hmZSyO3ui0o] |
| 485K | 12 | الصناعة العسكرية في المغرب: قوة صاعدة [EJiR4Kc1TvQ] |

Patterns visible from titles (verify by watching): news hook + "why now", a named stake (Morocco vs Spain/Algeria), "X scenarios" structures, explainer of institutions ("difference between ..."), emoji flags, 10-23 min runtime. Political/military topics: check advertiser-friendly guidelines before copying the niche.

## 1. YouTube policy and growth sources (read)

| Topic | Source | Saved locally |
|---|---|---|
| YPP changes effective 2027-02-01 (8,000 hrs or 20M Shorts views, active-channel rules, Premium Lite) | support.google.com/youtube/answer/12843009 | `docs/yt-ypp-changes-2027.html` |
| Monetization policies (inauthentic, reused, AI personas on sensitive topics) | support.google.com/youtube/answer/1311392 | `docs/yt-monetization-policies.html` |
| GenAI disclosure rules | support.google.com/youtube/answer/14328491 | `docs/yt-genai-disclosure.html` |
| A/B test titles and thumbnails (watch-time winner) | support.google.com/youtube/answer/16391400 | `docs/yt-ab-test.html` |
| Multi-language audio and localized thumbnails | support.google.com/youtube/answer/13338784 | `docs/yt-multilanguage-audio.html` |
| How recommendations work | support.google.com/youtube/answer/16089387 | `docs/yt-recommendations.html` |
| YouTube algorithm 2026 (Creator Insider summary) | vanpelt.studio/blog/youtube-algorithm-2026 | `docs/vanpelt-algorithm-2026.html` |
| Faceless channel $10k/month (Forbes, Sept 2026) | forbes.com/sites/jodiecook/2026/09/25/... | blocked by bot wall, not saved (key points are in the skill) |
| Visual explainer case study (anonymized, vendor) | outlierkit.com/resources/education-channel-case-study | `docs/outlierkit-education-case-study.html` |
| AI growth playbook | mentorme.com/blog/grow-a-youtube-channel-with-ai-2026 | `docs/mentorme-ai-playbook.html` |
| Kapwing faceless to 1,000 subs | kapwing.com/resources/we-grew-a-faceless-youtube-channel-to-1000-subscribers | `docs/kapwing-faceless-1000.html` |

Verified key facts: see `~/.claude/skills/youtube-infographic-business/references/monetization.md` and `analytics.md`.

## 2. Claude Code video-tool sources

### Frameworks
| Name | Why it matters | Link |
|---|---|---|
| Remotion + official agent skills | React video, skills: create, markup, render, captions, maps, docs, upgrade | remotion.dev/docs/ai/skills; github.com/remotion-dev/skills |
| Remotion Claude Code plugin | official plugin | remotion.dev/docs/ai/claude-code-plugin |
| HyperFrames (HeyGen) | HTML+GSAP video built for agents, Apache 2.0 | hyperframes.heygen.com; github.com/heygen-com/hyperframes |
| Remotion vs HyperFrames | same-brief test: ~12:30 vs ~11:50 (vendor test) | hyperframes.heygen.com/guides/hyperframes-vs-remotion |

Remotion license: free for individuals and companies up to 3 people, paid above (per HyperFrames docs; verify at remotion.pro/license).

### Reference pipelines / skills (GitHub)
| Repo | What to study |
|---|---|
| digitalsamba/claude-code-video-toolkit | brand profiles, per-scene TTS, narration-synced SVG charts (`LineChart`, `BarChart`, `cue()`), pre-render QC (`qc.py`: loudness, frozen frames, layout, contrast), word-timed captions |
| yashaiguy-dev/faceless-youtube-agents | channel "viral DNA" extraction, resumable state, thumbnail + draft upload |
| collij22/yt-faceless-automation | 8-subagent layout (research-analyst, scriptwriter, asset-curator, voiceover-producer, video-assembler, uploader, optimizer, revenue-analyst). Repo is cluttered; use as agent-role reference only |
| roeea2/faceless-youtube-video-creation | topic to research-backed script, narration, one image per beat, FFmpeg, upload |
| nagata-sys/remotion-video-pipeline | Remotion + TTS + AI video plugin |
| nebrass/hve-spielberg | 6-phase pipeline, multi-agent-CLI support |
| danielrosehill/Claude-AI-Video-Producer-Plugin | brief, storyboard, assembly, export |
| iliasabk/claude-skill-media-pipeline | images, voice, ffmpeg, shorts, upload |
| ajanaku1/demo-video-skill | Remotion + Edge TTS word-synced captions |
| Maartenlouis/remotion-ads | Remotion + ElevenLabs + word-by-word captions |
| cmak34/claude-remotion-skill, haidrrrry/claude-remotion-skill, fernandokaraka/remotion-motion-graphics-skill, jhartquist/claude-remotion-kickstart, balarabetahir/-Build-AI-Motion-Graphics-with-Claude-and-Remotion, neeraj10raja/Claude-code-reels | Remotion skills / starters / motion graphics with alpha |

Local clones (shallow) exist in `repos/` from an earlier step; another agent is handling downloads, so use that agent's copies as primary.

### Docs
| Topic | Link | Local |
|---|---|---|
| Remotion AI docs | remotion.dev/docs/ai/skills.md, /coding-agents.md | `docs/remotion-ai-*.md`, `docs/remotion-llms.txt` |
| HyperFrames docs | hyperframes.heygen.com/llms.txt, /llms-full.txt | `docs/hyperframes-*` |
| ElevenLabs forced alignment | elevenlabs.io/docs/capabilities/forced-alignment | `docs/elevenlabs-*` |
| Word-synced captions tutorial | dev.to (heynstudio) | `docs/dev-remotion-elevenlabs-captions.html` |
| Claude Code + Remotion tutorials | blog.openreplay.com/making-videos-claude-code-remotion; apidog.com/blog/claude-code-remotion | `docs/openreplay-*`, `docs/apidog-*` |
| HyperFrames guide | onewave-ai.com/blog/hyperframes-video-as-code | `docs/onewave-hyperframes-guide.html` |

## 3. Videos (subtitles only, no video files)

SRT in `videos/`:
| ID | Content | Files |
|---|---|---|
| jKRiib3Xzoo | YouTube A/B testing | en + ar SRT |
| gdDctjC10SY | YPP updates for Feb 2027 | en + ar SRT |
| rHLjxrbXmmY | Creator Insider: algorithm 2026 | not fetched: HTTP 429 from YouTube. Retry later |
| RzMBGTbBeJk | "How I Make Explainer Videos That Go Viral in 2026" | not fetched: HTTP 429. Retry later |

Retry command (subtitles only, no video):
`yt-dlp --skip-download --write-auto-subs --sub-langs en --convert-subs srt -o "%(id)s.%(ext)s" <url>`

## 4. Tool design decided so far

Pipeline: subject + news -> parallel research subagents -> sourced fact sheet -> scriptwriter (reads your `style.md`) -> voice + word timestamps -> motion-design subagent (Remotion scenes) -> QC -> MP4 -> thumbnail subagent (3 variants) -> human review gate -> private draft upload.
Decision pending: Remotion (recommended) vs HyperFrames; first channel language for voice engine (Arabic/Darija quality for ElevenLabs is `[INFERENCE]`, test before committing).

## 5. Open items
1. Two Creator Insider / explainer SRTs blocked by 429.
2. Forbes article not saved (bot wall).
3. Watch the top 10 reference videos (transcripts via SRT) to extract the structure; the style guide will come from you.
4. Check advertiser-friendly guidelines for political/military topics.

## 6. Voice (TTS): ElevenLabs alternatives and local cloning

Decision from owner: do NOT use ElevenLabs. Wants best local voice cloning. Language: Arabic (reference channel is Moroccan, Darija + MSA).
Status: research only, nothing installed or run. Unverified items marked `[INFERENCE]`.

### 6.1 Owner's machine (checked 2026-11-08)
| Item | Value |
|---|---|
| CPU | AMD Ryzen AI 9 365, 20 threads |
| RAM | 22 GB (about 9.6 GB free at check time) |
| GPU | AMD Radeon 880M integrated (gfx1150 family). No NVIDIA / CUDA. |
| Disk | 67 GB free of 475 GB (86% used) |
| Installed | Claude Code 2.1.287, Node 24, npm, FFmpeg 8.1, yt-dlp, Python 3.14, uv, Git, ImageMagick, Firefox |
| Missing | Bun, pnpm, Docker, Chromium/Chrome (Remotion downloads its own), Whisper / faster-whisper, torch, any TTS library |
| API keys | none found in environment |

### 6.2 Cloud options (non-ElevenLabs)
| Tool | Arabic | Cost (as read) | Source |
|---|---|---|---|
| Google Cloud TTS, Chirp 3 HD | MSA only (`ar-XA`, 30 voices) | 1M chars/month free, then $30 per 1M | lumisai.space/articles/arabic-ai-voice-tools-2026 |
| Azure AI Speech | 16 Arabic locales incl. Moroccan `ar-MA` | 0.5M chars/month free | same |
| OpenAI TTS | built-in voices, dialect unspecified | about $0.015/min (independent estimate) | same |
| Luel Darija TTS | Moroccan Darija, Arabic script + Arabizi | paid API, price not checked | luel.ai/lab/models/moroccan-darija-tts |
| Hakim, Munsit | Arabic specialists | not checked | vendor comparison pages (biased toward themselves) |

Luel claims lowest consensus character error on a 150-utterance Darija set (0.066 vs ElevenLabs v2 0.088), but: vendor benchmark, Luel column is best-of-8 vs single draws for competitors, and Luel scored lower on audio quality (DNSMOS 3.14 vs 3.37-3.45).

### 6.3 Local voice-cloning candidates
| Model | Arabic | License | Notes | Source |
|---|---|---|---|---|
| Habibi-TTS (F5-TTS based) | Dialects incl. Moroccan `MAR`, EGY, ALG, SAU, UAE, IRQ, TUN, LEV, LBY, OMN, SDN | Code MIT. Specialized models ALG/EGY/IRQ/MAR/MSA Apache 2.0. Unified, SAU, UAE models CC-BY-NC-SA-4.0 | `pip install habibi-tts`; repo has eval scripts vs Chatterbox, OmniVoice, XTTS-v2, ElevenLabs v3 (results not read). Darija fine-tunes on HF e.g. `Jip7e/habibi-tts-doda-darija` | github.com/SWivid/Habibi-TTS; arxiv.org/abs/2601.13802 |
| Chatterbox Multilingual V3 (Resemble AI) | Arabic, one model, no dialect control | MIT, 0.5B | Vendor says it beats ElevenLabs in listening tests (mainly English); outputs watermarked (PerTh) | huggingface.co/ResembleAI/chatterbox |
| OmniVoice (k2-fsa) | Yes | Apache 2.0 | Fastest in third-party benchmark (RTF 0.18, int8). Reported running on Radeon 890M | github.com/k2-fsa/OmniVoice |
| Higgs TTS 3 (4B) | Yes | not checked | Best open-weight Arabic rank seen (5th-11th in Arabic TTS Arena); about 8 GB RAM | huggingface.co/bosonai/higgs-tts-3-4b |
| Fish Audio S2 Pro | Yes | not checked (verify before commercial use) | Highest predicted naturalness on Arabic in benchmark; slowest (RTF about 2.8) | github.com/fishaudio/fish-speech |
| VoxCPM2, IndexTTS2, F5-TTS | VoxCPM2 Arabic yes; F5 official weights non-commercial | | Secondary candidates | soniqo.audio/blog/voice-cloning-benchmarks |
| Qwen3-TTS, Kokoro | **No Arabic** | Apache 2.0 | Excluded. Qwen lists Chinese, English, Japanese, Korean, German, French, Russian, Portuguese, Spanish, Italian | sekin.in Qwen3-TTS review |

### 6.4 Evidence and caveats
- Arabic TTS Arena (Navid-AI, about 8,800 votes, snapshot 2026-11-08): top 4 are closed (Coda-V2, AIC TTS v1, Gemini 3.1 Flash TTS, Audar-TTS-V1-Pro). Higgs TTS 3 is the first open-weight entry. Only lines 1-300 of 1,021 were read; Habibi / Chatterbox / OmniVoice ranks not seen. Full file: `artifact://15` at read time; refetch from huggingface.co/spaces/Navid-AI/Arabic-TTS-Arena (leaderboard.json).
- Soniqo benchmark (Jul 2026, FLEURS Arabic, 10 pairs): Arabic WER unreliable (scorer gets 32.8% on real human audio). Arabic RTF: OmniVoice 0.18, Chatterbox 1.10, VoxCPM2 1.14, Higgs 0.78, Fish 2.83. Hardware not stated `[INFERENCE: likely Apple Silicon]`. Do not use it to pick a winner.
- No independent blind test found that shows any local model matches ElevenLabs in Arabic or Darija.

### 6.5 Running on owner's hardware
- OmniVoice on Radeon 890M (github.com/Peterc3-dev/omnivoice-gfx1150): CPU about 50 s for 20 s of audio; GPU 41-49 s for 20 s. Slower than real time. A 14-minute video would take roughly 30-40 min `[INFERENCE: extrapolated]`.
- GPU path needs AMD experimental PyTorch (`https://rocm.nightlies.amd.com/v2-staging/gfx1150/`) plus `MIOPEN_FIND_MODE=FAST` and `HSA_OVERRIDE_GFX_VERSION=11.5.0`. Tested on 890M, not on owner's 880M.
- Other AMD ports found, not evaluated: navi-tts (Qwen3-TTS, no Arabic), Chatterbox_AMDVulkan (Strix Halo only), Qwen3-TTS-ROCm.
- Pocket TTS (Kyutai, CPU voice cloning): language support not checked.

### 6.6 Proposed procedure (not executed)
1. Prepare 10-30 s clean single-speaker reference (own voice or consenting voice actor).
2. Install each candidate in a separate Python venv (Habibi `MAR`, Chatterbox V3 `language_id="ar"`, OmniVoice).
3. Same 60-word Darija script, same reference, CPU first. Rename outputs, blind listen.
4. Production: generate per sentence, faster-whisper for word timing, FFmpeg loudness normalization (about -14 LUFS target for YouTube, per toolkit QC notes).

### 6.7 Legal / policy caution
Owner mentioned cloning voices from downloaded videos. Cloning another channel's narrator is impersonation: YouTube impersonation / inauthentic-content risk and likely rights issues. Clone own voice or a voice actor with written consent. Chatterbox adds an inaudible watermark to all outputs. Disclose synthetic voice if it could mislead (see `yt-genai-disclosure.html`: own-voice cloning for voiceover does not require the AI label).

### 6.8 Open items for voice
1. Verify Higgs TTS 3 and Fish Audio S2 Pro licenses.
2. Read Habibi paper results (arxiv 2601.13802) and the full Arabic TTS Arena file for open-model ranks.
3. Confirm Whisper / faster-whisper Darija accuracy on CPU.
4. Decide: cloud (Google / Azure `ar-MA` / Luel) vs local clone, after the blind test.

## 7. How the Darija narration is made (current pipeline, as built)

### 7.1 Model and tools
| Part | What | Why |
|---|---|---|
| TTS model | `openbmb/VoxCPM2` (2.3B, Apache 2.0 code + weights) | Commercial use OK; voice from text description (no cloning); Arabic in its 30 languages; CPU-runnable |
| Runtime | Python 3.12, torch 2.8.0+cpu, voxcpm 2.0.3 (`--no-deps`, deps installed manually) | CPU-only machines; `pip install voxcpm` pulls CUDA torch and breaks CPU install |
| Precision | float32 (forced via a local copy of the snapshot with `config.json` `dtype=float32`; weights symlinked) | Checkpoint is bf16; bf16 on CPU suspected as noise source |
| Long-form | `max_darija.py`: sentence-grouped chunks (~220 chars); chunk 1 uses a voice-design prompt; later chunks use `reference_wav_path` (speaker lock) + `prompt_wav_path`/`prompt_text` (previous chunk, for prosody continuity) | Avoids the hard cuts of independent chunks |
| Joining | 12 ms linear fades, peak normalized to 0.89, saved as PCM_24 | No silent gaps |
| Memory | `systemd-run --user --scope -q -p MemoryMax=16G -p MemorySwapMax=0` | Keeps the host responsive |

### 7.2 Benchmarks (measured)
| Machine | Setup | Speed |
|---|---|---|
| Local Ryzen AI 9 365, 22 GB | bf16, 10 steps, chunks of ~120 chars | ~9 s compute per 1 s audio (132 s in 1246 s) |
| Server i7-10610U (4C/8T), 30 GB | fp32, 30 steps | ~9 s/step; too slow (1.5 h+ per chunk) |
| Server i7-10610U, 30 GB | fp32, 10 steps, other apps running | chunk 1: 13.6 s audio in 511 s (~37x realtime) |

### 7.3 Video production (planned, not built yet)
1. Script in the user's style (style guide still needed).
2. Narration: VoxCPM2 chunks, joined as above.
3. Captions: faster-whisper (models exist on server) to get timestamps, check Darija accuracy first.
4. Visuals: infographics as HTML/SVG, animated with Remotion or HyperFrames (choice pending).
5. Render: ffmpeg, mix narration + music, export 1080p.
6. Thumbnail: separate HTML/SVG render at 1280x720.

### 7.4 Known risks
- Darija pronunciation and naturalness unverified by listening; needs user review per chunk.
- The model may fail on numbers, names, and English words; write them as Darija words in the script.
- Server speed depends on other apps; pause heavy apps during generation.
