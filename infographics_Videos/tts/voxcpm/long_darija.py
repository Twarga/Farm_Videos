"""Long Darija narration. Chunk 1 designs the voice; every later chunk reuses that voice as reference
so the narrator stays the same. Resumable: finished chunks in out/long/ are skipped."""
import os, re, time
import numpy as np
import soundfile as sf
import torch
from voxcpm import VoxCPM

VOICE = "(A Moroccan man in his forties, calm and confident news narrator, natural conversational pace, clear Darija pronunciation)"

SCRIPT = """السلام عليكم ومرحبا بيكم فهاد الفيديو الجديد. اليوم غادي نهضرو على واحد من أكبر المشاريع لي كيتبنا فالمغرب، وهو الطريق السيار المائي.
شنو هو هاد المشروع؟ وعلاش المغرب قرر يبنيه دابا؟ غادي نجاوبو على هاد الأسئلة وحدة بوحدة.
أولا، خاصنا نفهمو المشكل الأساسي، وهو الماء. فالسنين لخرين، المغرب عاش واحد الفترة ديال الجفاف قاسحة بزاف.
السدود ولاو ناقصين، والفلاحين والمدن بداو كيحسو بالخصاص. وهنا كتجي فكرة الربط بين الأحواض المائية.
الفكرة بسيطة: فين كاين الماء الزايد، كنجيبوه لفين كاين الخصاص.
الشمال فيه تساقطات كثر من الجنوب، وعندو سدود مليانين فبعض المواسم. بينما المناطق لخرين، خصوصا الوسط والجنوب، كتعاني من قلة الما.
وها علاش بداو يفكرو فواحد القناة كبيرة كتنقل الما من هاد لهيه. هاد القناة ماشي غير مجرد مشروع هندسي، هي قرار استراتيجي.
حيت الماء ولا هو الثروة الجديدة فهاد القرن. كل دولة كتحاول تأمن الماء ديالها قبل ما يوصل المشكل لمرحلة خطيرة.
دابا، شنو غادي يتبدل فحياة المواطن العادي؟
أولا، الماء الصالح للشرب غادي يوصل لمدن كانت كتعاني منو.
ثانيا، الفلاحة غادي تلقى شوية ديال الراحة، وهادشي مهم بزاف لأن الفلاحة كتشغل ناس كثار.
وثالثا، هاد المشروع غادي يخلق فرص شغل فمرحلة البناء والصيانة.
ولكن، خاصنا نكونو واقعيين، وماشي كلشي وردي. كاينين تحديات كبيرة، منها التكلفة، ومنها الطاقة لي كتحتاجها محطات الضخ.
وكاين كذلك سؤال ديال التوازن، يعني كيفاش نضمنو ما نضرّوش بالمناطق لي كنخديو منها الماء. وهادشي كيخلي النقاش مفتوح بين الخبراء والمسؤولين.
فالأخير، المشروع كيبين بلي المغرب كيحاول يستبق الأزمات، ماشي يستناها.
والسؤال الحقيقي هو: واش غادي يكفي هادشي وحدو؟ ولا خاص تعاون بين الدولة والمواطن، فترشيد استهلاك الماء؟
كتبو لينا رأيكم فالتعليقات، وشاركو الفيديو مع صحابكم. وبسلامة، حتى نلقاكم فالفيديو الجاي."""

os.makedirs("out/long", exist_ok=True)
sentences = [s.strip() for s in re.split(r"(?<=[.؟?!])\s+|\n", SCRIPT) if s.strip()]
chunks, cur = [], ""
for s in sentences:
    if cur and len(cur) + len(s) > 120:
        chunks.append(cur); cur = s
    else:
        cur = (cur + " " + s).strip()
if cur:
    chunks.append(cur)
open("out/long/script.txt", "w", encoding="utf-8").write("\n".join(chunks))
print(len(chunks), "chunks", flush=True)

model = VoxCPM.from_pretrained("openbmb/VoxCPM2", load_denoiser=False, optimize=False, device="cpu")
SR = model.tts_model.sample_rate
ref = "out/long/ref_voice.wav"
t0 = time.time()
for i, text in enumerate(chunks, 1):
    path = f"out/long/{i:02d}.wav"
    if os.path.exists(path):
        continue
    s = time.time()
    torch.manual_seed(42)
    if i == 1 or not os.path.exists(ref):
        wav = model.generate(text=f"{VOICE}{text}", cfg_value=2.0, inference_timesteps=10)
        sf.write(ref, wav, SR)
    else:
        wav = model.generate(text=text, reference_wav_path=ref, cfg_value=2.0, inference_timesteps=10)
    sf.write(path, wav, SR)
    print(f"{i}/{len(chunks)} {len(wav)/SR:.1f}s audio in {time.time()-s:.0f}s (total {(time.time()-t0)/60:.1f} min)", flush=True)

gap = np.zeros(int(SR * 0.3), dtype=np.float32)
parts = []
for i in range(1, len(chunks) + 1):
    w, sr = sf.read(f"out/long/{i:02d}.wav", dtype="float32")
    parts += [w, gap]
final = np.concatenate(parts)
sf.write("out/darija_long.wav", final, SR)
print(f"DONE {len(final)/SR:.0f}s total audio -> out/darija_long.wav", flush=True)
