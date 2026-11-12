# How to study a new reference video

Use this method when you find a new video you want to learn from.

---

## 1. Get the words

Download only the subtitles first:

```bash
yt-dlp --skip-download --write-auto-subs --write-subs \
  --sub-langs "ar.*,en.*" --convert-subs srt \
  -o "%(id)s.%(ext)s" "<video link>"
```

Read the first 30 seconds and the last 30 seconds first. They teach you the most.

---

## 2. Find the five anchors

Mark these before you analyze anything else:

1. **Hook** — the first sentence. Does it have a date, number or place?
2. **Early ask** — where is the first like/subscribe request?
3. **Chapters** — how many? What are their questions?
4. **Turn** — where does the tone change to risks or challenges?
5. **Ending** — what two next topics do they offer?

---

## 3. Count the numbers

Count:
- words;
- words per minute;
- numbers;
- questions;
- money mentions.

The reference channel: ~131 wpm, ~2,200 words for 15 minutes, 6–193 numbers,
5–31 questions.

If your script is far from these numbers, adjust it.

---

## 4. Watch the frames

Extract 16 frames:

```bash
ffmpeg -ss <time> -i video.mp4 -frames:v 1 -vf scale=480:270 frame.jpg
```

Or make a contact sheet with ImageMagick `montage`. Then ask:

- How many scene types do you see?
- Which one appears most?
- Where is the map? The stat card? The photo card?
- What color is the background? The accent?
- Is the text big enough to read on a phone?

---

## 5. Watch the motion

Extract 8 seconds at 2 frames per second and tile them:

```bash
ffmpeg -ss <start> -t 8 -i video.mp4 -vf "fps=2,scale=480:270" frames/%02d.jpg
```

Then look at the sequence:

- Does one element appear at a time?
- Do numbers count up?
- Do bars fill?
- Does the map zoom and draw a route?
- Does the chapter card wipe up?
- How long does the scene hold?

---

## 6. Write three lessons

After each video, write only three lessons:

1. One writing lesson.
2. One scene lesson.
3. One thing you will do differently.

Add them to your notes. Do not copy the video. Copy the **habit**.

---

## 7. Compare with your own draft

Take your latest script or scene. Put it next to the reference:

- Is your hook as concrete?
- Are your sentences as short?
- Does every number have a “يعني”?
- Do your scenes breathe, or are they too busy?
- Does your ending ask for the next topic?

Fix one thing at a time.
