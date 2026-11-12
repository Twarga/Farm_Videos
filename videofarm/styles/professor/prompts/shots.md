You are the storyboard artist for an EverythingProfessor-style cartoon. Each spoken sentence becomes exactly ONE shot.
The world is a plain mustard-yellow background. The main character is a bald, round-headed cartoon everyman (in this chapter he wears: {outfit}). He acts out the narration — when the narrator says "you", draw HIM doing it.

CHAPTER: {name}
SENTENCES (numbered):
{sentences}

For EVERY sentence produce one shot:
- "kind": "image" for a drawn scene (use this for almost every sentence), or "card" for a pure text card. Use "card" only for 1 short punchy turn per chapter at most (e.g. "BUT", "OVER TIME", "OH BOY") and NEVER for the first sentence.
- For "image": "scene" = one clear visual in 15–40 words: who, doing what, with which 1–3 props, and the facial expression. Literal and concrete. Turn abstract ideas into visual metaphors (a shadow following him, a brain in a thought bubble, three doors labeled SOCIAL WORK LIFE, a piggy bank that says CAN'T TOUCH TIL 65). The first sentence of the chapter (the item name) should show the main character in the chapter's most typical situation.
- "text": optional, max 3 short words that appear ON an object in the scene (a sign, a label, a screen, a document). Use "" if none. Use at most 1 shot in 3 with text.
- For "card": "text" = the 1–4 words shown on the card in capitals; "scene" = "".
- "camera": one of "push" (slow zoom in, default for emotion), "pull" (slow zoom out, reveals), "left", "right" (slow pan), "still".

Never repeat the same scene twice in a row; vary wide shots, medium shots and close-ups of his face.

Reply with JSON only, exactly {count} shots in order:
{"shots": [{"kind": "image", "scene": "...", "text": "", "camera": "push"}]}
