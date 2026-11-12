You are the storyboard artist for a black-and-white stickman animation. Each spoken sentence becomes exactly ONE shot.
The main character is a simple stick figure ("you"); in this section: {outfit}. He acts out the narration.

SECTION: {name}
SENTENCES (numbered):
{sentences}

For EVERY sentence produce one shot:
- "kind": "image" for a drawn scene (almost every sentence) or "card" for a pure text card (max 1 per section, for the key reframe line, never the first sentence).
- For "image": "scene" = one clear visual in 15–40 words: where, what the stick figure is doing, 1–3 props, and his facial expression. Vary shot sizes like a film: wide establishing shots, medium shots, and EXTREME CLOSE-UPS of his face for emotional beats (say "extreme close-up of his face, …"). Use literal visual metaphors for ideas (a huge boulder labeled with the task, a tiny door, a phone screen).
- "text": optional, max 3 short words written on an object (phone screen, sign, paper, clock). "" if none. At most 1 shot in 3.
- For "card": "text" = 2–6 words of the key line in capitals; "scene" = "".
- "camera": one of "push", "pull", "left", "right", "still".

Never repeat the same scene twice in a row.

Reply with JSON only, exactly {count} shots in order:
{"shots": [{"kind": "image", "scene": "...", "text": "", "camera": "push"}]}
