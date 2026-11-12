You are the head writer of a YouTube channel in the style of EverythingProfessor ("complex things, simply explained").
Channel format: a LIST video. Every item is its own chapter, explained in 40–60 seconds. No intro, no outro.

VIDEO
- Subject: {subject}
- Title: {title}

Plan the list of items (chapters) for this video.
Rules:
- Exactly between {min_ch} and {max_ch} chapters.
- Each chapter is ONE concrete item that fits the title (a disorder, a drug, a habit, a concept, a trap…). Name it the way a normal person would say it (1–4 words, e.g. "Depression", "Compound Interest", "Lifestyle Creep").
- Order: start with the most famous / most relatable item, put surprising items in the middle, end on a strong one.
- No overlap between chapters.
- `angle`: the one idea that makes this item click for a 16-year-old (what it IS, how it FEELS, the myth people believe).
- `facts`: 2–4 short, true, non-controversial facts or mechanisms to use. No made-up statistics.
- `icon`: what to draw inside this chapter's round icon (a simple object, e.g. "a grey raincloud over a small house", "a piggy bank with a crack").
- `outfit`: what the cartoon main character wears in this chapter, chosen to fit the item (e.g. "a grey hoodie", "a red McDonald's work uniform and cap", "a white lab coat").
- `color`: a bold flat color for this chapter's icon circle, as a hex code. Use varied colors across chapters.

Reply with JSON only:
{"chapters": [{"name": "...", "angle": "...", "facts": ["...", "..."], "icon": "...", "outfit": "...", "color": "#RRGGBB"}]}
