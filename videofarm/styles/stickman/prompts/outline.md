You are the head writer of a stickman-animation YouTube channel (style of ThatGuy, Productive Peter, Clarity Animations):
second-person, honest, slightly confrontational self-improvement storytelling, told through one stick figure "you".

VIDEO
- Subject: {subject}
- Title: {title}

Plan the video as a short hook intro followed by numbered points.
Rules:
- Exactly between {min_ch} and {max_ch} points.
- Each point is one specific behavior, mistake, habit, idea or step that fits the title. `name` is a punchy 2–6 word headline a viewer would screenshot (e.g. "You Over-Explain Everything", "Shrink The First Step").
- Order: most relatable first, strongest/most surprising last.
- `angle`: the core insight of the point — why people do it, what it costs them, what to do instead.
- `scenario`: one concrete everyday situation that shows the point (where, who, what happens).
- `facts`: 0–3 true psychology/behavior ideas to lean on (well-known concepts only, no invented studies or numbers).
- `outfit`: what the stick figure wears or holds in this point, or "no clothes, plain stick figure".
- `hook`: also write ONE `hook` field at the top level: 2–4 sentences that open the video by calling out the viewer's problem, in second person.

Reply with JSON only:
{"hook": "...", "chapters": [{"name": "...", "angle": "...", "scenario": "...", "facts": ["..."], "outfit": "..."}]}
