> This is a page from the ElevenLabs documentation. For a complete page index, fetch https://elevenlabs.io/docs/llms.txt. For the full documentation in a single file, fetch https://elevenlabs.io/docs/llms-full.txt.

# Forced Alignment quickstart

This guide will show you how to use the Forced Alignment API to align text to audio.

## Using the Forced Alignment API

#### Create an API key

[Create an API key in the dashboard here](https://elevenlabs.io/app/api/api-keys), which you’ll use to securely [access the API](/docs/api-reference/authentication).

Store the key as a managed secret and pass it to the SDKs either as an environment variable via an `.env` file, or directly in your app’s configuration depending on your preference.

**`.env`**

```js title=".env"
ELEVENLABS_API_KEY=<your_api_key_here>
```

#### Install the SDK

#### SDK

We'll also use the `dotenv` library to load our API key from an environment variable.

```python
pip install elevenlabs
pip install python-dotenv
```

```typescript
npm install @elevenlabs/elevenlabs-js
npm install dotenv
```

#### CLI

Install the ElevenLabs CLI. Homebrew (macOS) and Scoop (Windows) are recommended.

**`Homebrew (macOS)`**

```bash title="Homebrew (macOS)"
brew install elevenlabs/tap/elevenlabs
```

**`Scoop (Windows)`**

```powershell title="Scoop (Windows)"
scoop bucket add elevenlabs https://github.com/elevenlabs/scoop-bucket
scoop install elevenlabs
```

**`npm`**

```bash title="npm"
npm install -g @elevenlabs/cli
```

**`curl`**

```bash title="curl"
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/elevenlabs/cli/releases/latest/download/elevenlabs-cli-installer.sh | sh
```

> **Tip**
>
> Working with an AI coding assistant? Run `elevenlabs generate-skills` in your project to write a
> `SKILL.md` for every command group into `skills/`, so your assistant knows the CLI's full surface
> without you pasting docs. Use `--output-dir` to put them elsewhere. This reads the CLI's own
> embedded API definition, so it needs no API key and works offline — and it stays in step with
> whichever CLI version you have installed.

Then authenticate — this opens your browser to authorize the CLI:

```bash
elevenlabs auth login
```

#### Make the API request

#### SDK

Create a new file named `example.py` or `example.mts`, depending on your language of choice and add the following code:

```python maxLines=0
# example.py
import os
from io import BytesIO
from elevenlabs.client import ElevenLabs
import requests
from dotenv import load_dotenv

load_dotenv()

elevenlabs = ElevenLabs(
    api_key=os.getenv("ELEVENLABS_API_KEY"),
)

audio_url = (
    "https://storage.googleapis.com/eleven-public-cdn/audio/marketing/nicole.mp3"
)
response = requests.get(audio_url)
audio_data = BytesIO(response.content)

# Perform the text-to-speech conversion
transcription = elevenlabs.forced_alignment.create(
    file=audio_data,
    text="With a soft and whispery American accent, I'm the ideal choice for creating ASMR content, meditative guides, or adding an intimate feel to your narrative projects."
)

print(transcription)
```

```typescript maxLines=0
// example.ts
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import "dotenv/config";
const elevenlabs = new ElevenLabsClient();

const response = await fetch(
    "https://storage.googleapis.com/eleven-public-cdn/audio/marketing/nicole.mp3"
);
const audioBlob = new Blob([await response.arrayBuffer()], { type: "audio/mp3" });

const transcript = await elevenlabs.forcedAlignment.create({
    file: audioBlob,
    text: "With a soft and whispery American accent, I'm the ideal choice for creating ASMR content, meditative guides, or adding an intimate feel to your narrative projects."
})

console.log(transcript);
```

Then run it:

```python
python example.py
```

```typescript
npx tsx example.mts
```

You should see the transcript of the audio file with exact timestamps printed to the console.

#### CLI

Download the sample audio, then align it with the transcript:

```bash
curl -O https://storage.googleapis.com/eleven-public-cdn/audio/marketing/nicole.mp3

elevenlabs forced-alignment create \
  --file nicole.mp3 \
  --text "With a soft and whispery American accent, I'm the ideal choice for creating ASMR content, meditative guides, or adding an intimate feel to your narrative projects."
```

The alignment with per-word timestamps is printed to your terminal.

## Next steps

#### [Speech to Text](/docs/eleven-api/guides/cookbooks/speech-to-text)

Transcribe audio to text without requiring an existing transcript

#### [Text to Speech](/docs/eleven-api/guides/cookbooks/text-to-speech)

Generate the audio from text to use with forced alignment

#### [API reference](/docs/api-reference/forced-alignment/create)

Explore all Forced Alignment parameters and response formats