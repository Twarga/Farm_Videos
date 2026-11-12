# The Shell Journey — Original Orchestral Score Notes

## Master Measurements
- **Target Duration:** 129.0 s (6192000 samples at 48000 Hz, stereo 24-bit PCM)
- **Integrated Loudness:** -14.00 LUFS (target ~ -14 LUFS)
- **True Peak:** -1.40 dBTP (target ≤ -1.0 dBTP)
- **Master SHA256:** `487060fed003c9fd71e503e2317230cad39b8ea9ee86237a780e99b6be23d47f`
- **Determinism:** Seed-locked (42) byte-identical reproducibility

## Dynamic Range & Section RMS
| Section | Timing | Target (Pre-norm) | Measured (Pre-norm) | Master score.wav |
|---|---|---|---|---|
| prologue   |   0.0s –   4.6s | -32.0 dBFS | -32.0 dBFS | -34.4 dBFS |
| home       |   4.6s –  17.4s | -27.0 dBFS | -27.0 dBFS | -29.4 dBFS |
| sea        |  17.4s –  33.6s | -22.0 dBFS | -22.0 dBFS | -24.4 dBFS |
| storm      |  33.6s –  43.0s | -17.0 dBFS | -17.0 dBFS | -19.4 dBFS |
| loss       |  43.0s –  45.6s | -38.0 dBFS | -38.0 dBFS | -40.4 dBFS |
| storm2     |  45.6s –  49.4s | -16.0 dBFS | -16.0 dBFS | -18.4 dBFS |
| desert     |  49.4s –  67.8s | -22.0 dBFS | -22.0 dBFS | -24.4 dBFS |
| ice        |  67.8s –  79.4s | -31.0 dBFS | -31.0 dBFS | -33.4 dBFS |
| forest     |  79.4s –  93.4s | -21.8 dBFS | -21.1 dBFS | -23.5 dBFS |
| arrive     |  93.4s – 101.0s | -25.0 dBFS | -24.9 dBFS | -27.3 dBFS |
| breath     | 101.0s – 103.0s | -42.0 dBFS | -42.0 dBFS | -44.4 dBFS |
| lights     | 103.0s – 109.0s | -15.0 dBFS | -15.0 dBFS | -17.4 dBFS |
| climax     | 109.0s – 115.0s | -13.0 dBFS | -13.0 dBFS | -15.4 dBFS |
| title      | 115.0s – 119.4s | -18.0 dBFS | -18.0 dBFS | -20.4 dBFS |
| keeper     | 119.4s – 129.0s | -22.0 dBFS | -16.3 dBFS | -18.8 dBFS |

## Sample Libraries Used (CC0)
- **VSCO-2-CE (Versilian Studios Chamber Orchestra 2: Community Edition)**
  - Strings: Harp, Solo Violin, Violin Section, Viola Section, Cello Section, Solo Contrabass
  - Brass: F Horn, Trumpet, Tenor Trombone, Tuba
  - Woodwinds: Bassoon, Clarinet, Flute
  - Keys: Upright Nr1 (high register pp felt hammer)
  - Percussion: Timpani (hits and rolls), Bass Drum, Ethnic Taiko (hand & mallet), Cymbals (swells & crashes), Triangle
- **VCSL (Versilian Community Sample Library)**
  - Idiophones: Marimba (soft, medium, loud), Glockenspiel, Tubular Bells 2, Wine Glasses (friction sustains)
  - Membranophones: Frame Drum (low & high), Small Shakers
- **Synthesised Sound Design (`film/music/sfx.py`)**
  - Tactile thread stitches, oceanic waves & foam, deep whale formant vocalization, turbulent storm & cold wind, granular rain, brutal lightning thunder with sub boom, silky sandfall, crystalline ice crack, firefly harmonic micro-pings, felt footsteps, orchestral braam, rising tension riser.

## Section-by-Section Orchestration
1. **Prologue (0.0s – 4.6s, Energy 1):** Amber needle sews the horizon. Soft music-box notes (F#5, B5, D6, F#6, E6, D6, B5) over subtle friction stitch pulls.
2. **Home (4.6s – 17.4s, Energy 2):** Lonely and tender. The 4-note theme (B–D–F#–E) stated alone on music box / celesta, answered warmly by solo cello. Deep cello note at departure as they face the sea.
3. **Sea (17.4s – 33.6s, Energy 5):** Wonder and flow in rolling 6/8. Sweeping harp arpeggios, cello and viola counter-melodies, radiant string swell at the crest. Deep whale song below waterline. Spout shimmering burst (harp gliss + celesta + cymbal swell); catch on glockenspiel.
4. **Storm (33.6s – 49.4s, Energy 9):** First peak. Relentless 16th-note string ostinato, massive low brass BRAAMs, taiko and timpani strikes, crash cymbal against black cliffs. Total drop to silence at the loss: one fragile, heartbroken solo violin note. Blinding lightning hit + second pull hit with thunder.
5. **Desert (49.4s – 65.4s, Energy 6):** Hypnotic walking groove ~96 bpm. Cello drone, frame drum, congas, shaker. Expressive bassoon reed melody built on the theme. Playful woodwind/glock upward run on sledding dune; warm flute theme at the night flower.
6. **Ice (65.4s – 79.4s, Energy 2):** The low point, NO pulse. Frozen lake glassy stillness. Ethereal wine glass harmonics, sparse celesta, high violin harmonic. Crystalline ice crack SFX + low resonant note. Almost silence as the VM's eyes dim.
7. **Forest (79.4s – 93.4s, Energy 4→8):** The build. Firefly chimes, driving marimba ostinato, accelerating pulse feel (100→120 bpm). Warm major chord bloom at relight (G→D major). Horns and violins return the theme bigger at the branch. Riser into starry sky.
8. **Home Again & The Lighting (93.4s – 109.0s, Energy 3→1→10):** Soft arrival, footstep pizzicato placing 4 shells. Held breath (near silence). The 4 huge hits: B (light1), D (light2), F# (light3), E (light4) in full orchestra + timpani + tubular bell.
9. **Climax (109.0s – 119.4s, Energy 10):** The sea answers! Whole theme in full orchestra. Every world's instrument joining (music box, harp, taiko, frame drum, celesta, marimba, strings, brass, timpani). Threads ascending to title resolution.
10. **Resolution & Lockup (119.4s – 129.0s, Energy 8→0):** Warm sustained strings, theme echo on harp. 5 rising bell notes + French horn swell; final chord burst with clash cymbal; byline ring-out decaying to silence by T=129.0s.
