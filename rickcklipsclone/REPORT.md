# Ricks Clips (@RicksClips3000): how the hit Shorts are made

Data: 150 Shorts listed (170K subs). I downloaded the 16 most-viewed ones, transcribed them with faster-whisper small.en using word timestamps, pulled a frame every 3 s plus 4 fps sequences, and measured pacing, audio, and color.
Files in this folder: `videos/` (mp4 + info.json), `transcripts/` (txt + word-timed json), `frames/` (contact sheets, full-res caption frame).

## 0. Which format actually wins

The channel ran on recycled content first: live-action movie recaps (`LUGcyIwlcto`, 15M), comic dubs ("I only do the voice", `RVnC1DSfK30`) and 😭🤣 skits.
The current format is original 2.5D animated story-explainers, uploaded Oct 11 – Nov 4 2026. It owns the top of the chart:

| Views | Title | Real topic behind it |
|---|---|---|
| 33.5M | The Ancient Jar That Warned an Empire | Zhang Heng's seismoscope (132 AD) |
| 28.2M | Why Perfect Railroads Don't Work | Rail thermal-expansion gaps |
| 17.7M | The Job Nobody Wants in Japan | *Oidashi-beya* "chasing-out rooms" |
| 15.9M | Why Sailors Carried Storm Oil | Pouring oil on troubled waters |
| 15.4M | The Window That Breaks Japan's Gambling Law | Pachinko three-shop system |
| 15.7M | Your Brain's Secret Idea Zone | Edison's steel-ball naps / hypnagogia |
| 12.7M | What the Grave Bell Really Meant | Safety coffins |
| 9.9M | The Pink Prison Cell Experiment | Baker-Miller pink |
| 9.6M | Levels of Pirate Cannonballs | Langrage, hot shot, carcass, Rodman gun |
| 9.5M | This Shape Saved Roller Coasters | Clothoid loop vs circular loop |
| 9.4M | Why the Second Draw Always Wins | Reaction vs. decision time (Bohr's gunfight idea) |
| 9.3M | The Burglar Who Only Moved Furniture | Fictional heist / gaslighting story |
| 9.2M | Why Humans Can't Pick Random Numbers | Benford's law + streakiness |
| 8.8M | Why Cashiers Keep Winning The Lottery | Lottery retailer sting operations |

Topic rule: **one real, counter-intuitive mechanism** (physics, law loophole, psychology, history), dramatized as a mini-story. Real people stay unnamed ("the inventor", "a scientist", "he").

## 1. Characters

- **Body**: oversized round head, white or cream (about 35–45 % of body height). Pill or bean-shaped torso in one flat clothing color. Legs and arms are thin black stick lines ending in small round hands. No neck.
- **Line**: one thick dark outline (near-black / dark brown) around every character and prop. Flat fills with at most one soft shading tone.
- **Faces**: dot or ring eyes, sometimes oversized round glasses. Eyebrows do most of the acting (smug, angry, worried). Mouths are a line, a toothy grimace grid, or a big grin. Sweat-drop and closed-eye "^ ^" smile are standard expressions.
- **Identity by costume**: the hat or hair is the whole character design: emperor's crown, chef hat, naval bicorne, pirate bandana with polka dots, newsboy cap, top hat, prison cap, nightcap. Era-correct props tell you the setting instantly.
- **Literal gags**: the script line becomes a visual. "His face goes purple" gets a purple head. "Your brain" gets a translucent blue body with a pink brain inside. "Crushed like a soda can" shows a crushed dummy.
- **Cast size**: protagonist, a mocking authority (emperor, boss, captain, rival, cop), and background extras reused in different colors.
- **Built as 2D cards in 3D space** [INFERENCE from frames: characters stay flat and keep a constant outline while the camera orbits]. The look matches billboarded 2D sprites or Grease Pencil characters inside a 3D set.

## 2. The 3D world

- **Real 3D sets** with stylized, hand-painted textures and outlined edges: throne halls, canyons, ship decks, pachinko halls, Japanese offices, prison pods, snowy 1800s streets, desert banks.
- **Camera = one continuous take**. FFmpeg scene detection at threshold 0.3 finds 0–1 hard cuts per video. The camera keeps moving: slow dolly push-ins, orbits around the subject, drone fly-overs (city at night, farmland), fly-throughs into the next location, and short cross-dissolves (ghosted double frames in the samples). The 4 fps sequence shows a steady push-in during every sentence.
- **Shot vocabulary**: establishing aerial → mid-shot of the character next to the key prop → extreme close-up of the mechanism → **cutaway or cross-section diagram** at the reveal (ground layers under the city, the pendulum inside the jar, a brain-wave depth chart, a coffin underground with the bell rope).
- **Lighting is cinematic**: warm practical lights (torches, lamps, single bulb), volumetric god-rays, bloom, golden-hour sunsets, moonlit blue nights, depth-of-field blur on backgrounds, light snow/dust particles. FX moments (explosion, splinters, glowing hot shot) are full 3D VFX.
- **Environmental storytelling**: readable in-world signs carry the joke ("CAREER DEVELOPMENT ROOM", "PRIZE COUNTER", "HOT SHOT", "LANGRAGE" barrel, "FIRST LINE IN GETS IT ALL", "GRAVY BOAT", Japanese text on signs).

## 3. Colors

Measured over all contact sheets (new format only): mean saturation 42 %, mean brightness 56 %, 39 % of pixels above 50 % saturation. That is rich color without neon.

Dominant k-means palette:
`#281d2c` deep plum shadow · `#283569` navy · `#304dbb` royal blue · `#5890d5` sky blue · `#a6bad2` haze blue · `#643931` brown wood · `#a65441` brick red · `#d09550` amber/gold · `#ddb698` warm skin/sand · `#e9e4de` off-white heads · `#6da75d` grass green · `#020103` outline black.

Rules seen across videos:
- **Warm vs. cool contrast** in almost every frame: amber, red and gold lights against blue or indigo shadows. Night scenes push everything blue-violet with orange light sources.
- Each story gets **one theme color** (pink cell, red canyon, blue-green office, gold-red throne room, neon pachinko).
- White heads with black outlines always read against these mid-value backgrounds, which keeps characters legible on a phone.

## 4. Captions

- **1–3 words per card**, swapped in sync with the voice. Phrases stay together ("a dragon's", "the emperor", "without a sound", "into the elevator").
- **Font**: heavy geometric sans, white, sentence case, punctuation kept ("jar,", "arrested.", "how?"). It looks like Montserrat Black/ExtraBold or similar [INFERENCE: exact font not confirmed].
- **Style**: about 5 px black outline plus a soft dark drop shadow. No colored keyword highlight, no emojis, no background box.
- **Size and position**: about 85–90 px font on a 1080×1920 frame (cap height ≈ 65 px). Centered horizontally, vertical center ≈ 70 % down (y ≈ 1345 px). That keeps it clear of the faces in the middle and above the Shorts UI at the bottom.
- No title card, no progress bar, no watermark.

## 5. Voice and audio

- Narration starts at **0.00 s** in every video and ends within **0.2–0.5 s** of the last frame. There is no intro or outro, so the video loops cleanly.
- **200–245 wpm** (median about 220). One male storyteller in a conversational, slightly wry tone. Character lines are voiced inside the narration ("goes, …").
- A music/SFX bed sits under the voice: RMS in voice pauses ≈ −25 dB vs. ≈ −17 dB during speech, so the bed is about 8 dB below the voice. SFX match on-screen actions (clangs, bells, splashes).
- Length: 39–65 s, 145–246 words. Most hits are 56–65 s.

## 6. How the scripts are written

### The formula (12 of 14 new-format hits follow it exactly; "Levels of Pirate Cannonballs" is a tiered list and "Random Numbers" is a straight explainer with the same hook and analogy steps)

1. **Cold-open hook (sentence 1, 7–20 words)**: a strange action stated as fact, no context.
   - "He put a bronze ball in a dragon's mouth and told the Emperor, if this ever falls out, run."
   - "He sawed gaps into a railroad every 39 feet."
   - "They buried a man alive with a bell tied to his finger."
   - "They painted the jail cell pink, and not just any pink."
   - Variants: paradox ("Gambling is illegal in Japan, yet there's a gambling hall on almost every street."), stakes flip ("If your ship got hit by a cannonball, you'd actually be one of the lucky ones."), conditional ("If you ever fake a number, there's a way to tell…").
2. **"You see," context drop at 4–11 %**: the setup in one or two sentences.
3. **Mockery and stakes**: an authority laughs at the protagonist (court laughs, boss's face goes purple, captain yells, rival laughs, cop laughs "all the way back to his car"). The protagonist stays calm and gives no explanation, so the viewer has to wait for it.
4. **Escalation with time markers**: "Weeks later…", "Then summer comes…", "In May… By July…", "Then one night…", "By midnight…", "At 15 minutes… At 20…".
5. **Short punchy quoted jabs** that land as jokes: "Hey, it's the toy guy. Did your frogs get hungry again?", "Barbie's gonna love it in here.", "You're making soup?"
6. **The viewer's question asked out loud**: "Wait, what?", "How is that possible?", "But how?", "Wait, practiced?"
7. **Climax image**: disaster or twist shown first ("The next morning, the palace was a pile of rubble.").
8. **"You see," reveal at 65–91 %**: the real mechanism, explained through an **everyday analogy** (blowing on soup, catching a falling phone, a car taking a hairpin at 60, elevator buttons for Benford's law).
9. **Final line = ironic payoff**, then the video stops. The doubters get punished, or there's a dark twist ("every debt got buried right along with him, and the house was all hers"). No CTA.

### Line-level style

- Switches to present tense after the hook ("His captain grabs him by the collar and goes…"). Second person for immersion ("Imagine your boss walks you past your desk…", "So, you win a bucket yourself…").
- Average 10–17 words per sentence, broken by fragments ("Rail touching rail.", "Three short, one long.").
- Spoken-English connectors: "So,", "But", "Then", "Well,", "Now, here's the weird part." Idioms: "couldn't be happier", "for free", "story of my life".
- Concrete numbers everywhere: 39 feet, 15 minutes, 300 pounds, 1 pint per gallon, $2 million, 50 yards, 3 years.
- Every sentence describes something drawable. That is what lets the camera keep moving without cuts.

### Script template (about 220 words / 60 s)

```
[HOOK – strange action, no context]  He/They did <weird thing>.
You see, <one-sentence setup + stakes>.
<Authority> laughs / gets furious: "<one mocking line>".
But he won't <stop>. <Visual detail of the odd method>.
<Time marker>, <first result looks like failure>. They laugh even harder.
<Time marker>, something weird happens. <Escalation 1>. <Escalation 2>.
"<Second jab>"  / Wait, what?
<Climax image: disaster hits the doubters / twist revealed>.
You see, <real mechanism> — like <everyday analogy>.
<One-line ironic payoff.>  [END, no outro]
```

## 7. Production pipeline to clone it [INFERENCE: reconstructed from observed output]

1. Pick a real counter-intuitive mechanism and write about 220 words using the template.
2. Record the VO at about 220 wpm, or generate it with TTS tuned to a casual narrator. Cut all breaths and leave at most 0.3 s pauses.
3. Storyboard **one camera move per sentence** and a cross-section/diagram shot at the reveal.
4. Build 3D sets with stylized textures and outlines (Blender/Unreal). Place 2D outlined characters as camera-facing cards. Animate eyebrows, mouths and arm swings.
5. Light every scene with warm practical lights against cool fill. Add bloom, DOF and volumetrics. Give each story one theme color.
6. Generate word timestamps (Whisper). Burn in 1–3-word white captions with black stroke and shadow at y ≈ 70 %.
7. Mix the music bed about 8 dB under the voice plus action SFX. Export 1080×1920 at 30 fps, 40–65 s, with VO from frame 0 to the last frame.
