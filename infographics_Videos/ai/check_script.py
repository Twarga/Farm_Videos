#!/usr/bin/env python3
"""Check a Darija script against the channel style.

Used by the AI before voice/scenes. Exit code 0 = pass (score >= 90, no FAIL).
"""
import argparse
import json
import re
import sys

DARIJA = set(
    "شنو كيفاش غادي غاديين دابا بزاف ديال كاين كاينة كيدير كيديرو خاصنا واخا دروك "
    "تماك هاد هادي هادو نتا نتوما احنا بصح غير باش مزيان شحال علاش فين امتى دوك "
    "ديالنا ديالهم كيما بحال صافي يالله خلينا شوف تخيل تصور سمع راه راهو ماشي "
    "والو شي حاجة ناس بلاد فلوس درهم مليار مليون".split()
)

MONTHS = (
    "يناير|فبراير|مارس|أبريل|ماي|يونيو|يوليوز|غشت|شتنبر|أكتوبر|نونبر|دجنبر"
)

NUMBER_WORDS = (
    "ثلاثة|ثلاث|أربعة|أربع|خمسة|خمس|ستة|ست|سبعة|سبع|ثمانية|ثماني|تسعة|تسع|"
    "عشرة|عشر|مائة|مئة|ألف|مليون|مليار|نصف|ضعف|ضعفين|الضعف"
)

PLACES = (
    "المغرب|الدار البيضاء|الرباط|طنجة|الناظور|خريبكة|الصحراء|أكادير|مراكش|"
    "فاس|مكناس|وجدة|تطوان|العيون|الداخلة|الجديدة|آسفي|بني ملال|القنيطرة|سلا|"
    "المحمدية|خنيفرة|ورزازات|الصويرة|تازة|الحسيمة|الرشيدية|كلميم|السعيدية"
)


def arabic_words(text):
    return re.findall(r"[\u0600-\u06FF]+", text)


def digits(text):
    return re.findall(r"[0-9٠-٩]+", text)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("script")
    parser.add_argument("--minutes", type=float, default=15)
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()

    raw = open(args.script, encoding="utf-8").read()
    markers = re.findall(r"\[SCENE:\s*([a-zA-Z_-]+)\]", raw)
    body = re.sub(r"\[SCENE:[^\]]+\]", " ", raw)
    # drop markdown headings, keep their text out of the word count
    body = re.sub(r"^#{1,6}\s.*$", " ", body, flags=re.M)

    words = arabic_words(body)
    n = len(words)
    sentences = [s.strip() for s in re.split(r"[.!؟?]+", body) if s.strip()]
    sentences = [s for s in sentences if arabic_words(s)]
    questions = body.count("؟") + body.count("?")
    numbers = digits(body)
    yani = body.count("يعني")
    darija = sum(1 for w in words if w in DARIJA)
    target = args.minutes * 131
    wpm = n / args.minutes if args.minutes else 0
    avg_sentence = n / len(sentences) if sentences else 0
    hook = " ".join(sentences[:2])
    first_words = " ".join(words[:300])
    last_words = " ".join(words[-180:])

    checks = []

    def add(level, message):
        checks.append((level, message))

    # word count
    if n < target * 0.85:
        add("FAIL", f"Too short: {n} words, target ~{target:.0f} (±15%).")
    elif n < target * 0.95:
        add("WARN", f"Slightly short: {n} words, target ~{target:.0f}.")
    elif n > target * 1.15:
        add("FAIL", f"Too long: {n} words, target ~{target:.0f}.")
    elif n > target * 1.05:
        add("WARN", f"Slightly long: {n} words, target ~{target:.0f}.")
    else:
        add("PASS", f"Word count: {n} (~{target:.0f}).")

    # pace
    if not (120 <= wpm <= 145):
        add("WARN", f"Pace: {wpm:.0f} wpm; target 120–145.")
    else:
        add("PASS", f"Pace: {wpm:.0f} wpm.")

    # hook
    has_hook_number = bool(digits(hook)) or bool(re.search(MONTHS, hook)) or bool(
        re.search(r"20[0-9]{2}|19[0-9]{2}", hook)
    )
    has_number_word = bool(re.search(NUMBER_WORDS, hook))
    has_place = bool(re.search(PLACES, hook))
    has_myth = ("كيظنوا" in hook) or ("بزاف ديال" in hook)
    if not (has_hook_number or has_number_word or has_place or has_myth):
        add("WARN", "Hook: no number/date/place/myth marker in first 2 sentences.")
    elif re.match(r"^(السلام|مرحبا|أهلا|بيكم|صباح)", hook):
        add("WARN", "Hook starts with a greeting; start with a fact instead.")
    else:
        add("PASS", "Hook: contains a number/date/place.")

    # questions
    q_min = 8 if args.minutes >= 10 else 2
    if questions < q_min:
        add("WARN", f"Only {questions} questions; aim for {q_min}+.")
    else:
        add("PASS", f"Questions: {questions}.")

    # numbers + "يعني"
    if numbers:
        if yani < max(1, len(numbers) // 6):
            add("WARN", f"Only {yani} 'يعني' for {len(numbers)} numbers.")
        else:
            add("PASS", f"Number explanations: {yani} 'يعني' for {len(numbers)} numbers.")

    # Darija ratio
    ratio = darija / n if n else 0
    if ratio < 0.05:
        add("WARN", f"Darija markers low: {ratio * 100:.0f}%.")
    else:
        add("PASS", f"Darija markers: {ratio * 100:.0f}%.")

    # sentence length
    if avg_sentence > 15:
        add("WARN", f"Average sentence: {avg_sentence:.1f} words; keep it ≤15.")
    else:
        add("PASS", f"Average sentence: {avg_sentence:.1f} words.")

    # early CTA
    cta_words = ("لايك", "اشترك", "شارك", "التعليقات", "الكومنت")
    if not any(w in first_words for w in cta_words):
        add("WARN", "No early like/subscribe/comment ask in the first ~300 words.")
    else:
        add("PASS", "Early CTA found.")

    # chapter markers
    chapters = sum(1 for m in markers if m.lower().startswith("chapter"))
    ch_min = 3 if args.minutes >= 10 else 2
    if chapters < ch_min:
        add("FAIL", f"Chapter markers: {chapters}; need {ch_min}+.")
    else:
        add("PASS", f"Chapter markers: {chapters}.")

    # scene markers
    scene_min = 8 if args.minutes >= 10 else 4
    if len(markers) < scene_min:
        add("FAIL", f"Scene markers: {len(markers)}; need {scene_min}+.")
    else:
        add("PASS", f"Scene markers: {len(markers)}.")

    # outro
    outro_comment = ("التعليقات" in last_words) or ("الكومنت" in last_words)
    outro_next = ("الحلقة الجاية" in last_words) or ("حلقة جاية" in last_words)
    outro_choice = (" ولا " in last_words) or ("أو" in last_words)
    if not outro_comment:
        add("FAIL", "Outro: no comment ask.")
    if not outro_next:
        add("FAIL", "Outro: no 'next episode' line.")
    if not outro_choice:
        add("WARN", "Outro: offer two next topics (A ولا B).")
    if outro_comment and outro_next and outro_choice:
        add("PASS", "Outro: comment + next episode + two choices.")

    score = 100
    for level, _ in checks:
        if level == "FAIL":
            score -= 10
        elif level == "WARN":
            score -= 5
    score = max(0, score)

    longest = sorted(sentences, key=lambda s: len(arabic_words(s)), reverse=True)[:3]

    result = {
        "file": args.script,
        "words": n,
        "target_words": round(target),
        "wpm": round(wpm, 1),
        "questions": questions,
        "numbers": len(numbers),
        "yani": yani,
        "darija_ratio": round(ratio, 3),
        "avg_sentence_words": round(avg_sentence, 1),
        "chapters": chapters,
        "scene_markers": len(markers),
        "score": score,
        "checks": checks,
    }

    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(f"FILE: {args.script}")
        print(
            f"WORDS: {n} (target ~{target:.0f}) | WPM: {wpm:.0f} | "
            f"QUESTIONS: {questions} | NUMBERS: {len(numbers)} | يعني: {yani}"
        )
        print(f"SCORE: {score}/100\n")
        for level, message in checks:
            print(f"  [{level}] {message}")
        if longest:
            print("\nLongest sentences:")
            for s in longest:
                print(f"  - ({len(arabic_words(s))} words) {s[:160]}")

    ok = score >= 90 and not any(level == "FAIL" for level, _ in checks)
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
