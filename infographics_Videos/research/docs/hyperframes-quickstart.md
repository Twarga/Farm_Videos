> ## Documentation Index
> Fetch the complete documentation index at: https://hyperframes.heygen.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Make your first video

> Make your first HyperFrames video in the free Studio app for Mac, Windows and Linux, with your own AI agent, or in an AI chat with nothing to install.

HyperFrames turns one sentence into a video you can keep editing. Start in the Studio app; if you already work with an
AI agent in a terminal, or your computer can't run the app, use one of the other two ways. All three make the same
kind of project.

<video aria-label="A first video in the Studio app: one request, a few questions, a storyboard, the finished film" src="https://static.heygen.ai/hyperframes-oss/docs/studio-demos/first-video-demo-v2.mp4" poster="/public/images/studio-app/first-video-demo-v2.jpg" muted loop playsInline preload="metadata" />

> [card] [Download the HyperFrames Studio app](https://hyperframes.studio/studio/download?src=docs-quickstart-top)
>
> Free for Mac, Windows and Linux. The link picks the right file for your computer.

## In the Studio app

The easiest way: the app runs your agent beside a live preview, and you change the video by typing, pointing or
drawing. For Mac (Apple Silicon or Intel), Windows (including Windows on Arm) and Linux.

**1. Download and install**

[Download the Studio app](https://hyperframes.studio/studio/download?src=docs-quickstart), open it, and
sign in with a free HeyGen account. [Install the Studio app](https://hyperframes.heygen.com/studio-app.md) has the steps for each system.

**2. Ask for the video**

Type what you want in **Make something** and send it. Framey asks a few questions, shows a storyboard, then
builds the film.

**3. Change it**

Ask for changes in the chat, or point at the picture. [Make your first video in the app](https://hyperframes.heygen.com/studio-app/first-video.md)
walks through it.

> [card] [Practice it: The brief](https://hyperframes.heygen.com/lessons/the-brief)
>
> Free 20-minute lesson with a short video, a quiz and a brief to try. A brief is the goal, who it is for, two to four specifics and the exact words in quotes.

## With your agent

For Claude Code, Codex, Cursor, Copilot, Gemini CLI or any agent that works in a folder on your computer, on any
system.

### The short way

Unless the HyperFrames plugin is installed, install the skills once from a terminal in your project folder, then
open or restart your coding agent there:

```bash theme={null}
npx hyperframes skills update
```

Paste this into the agent. It makes the video and opens the preview. You only change the URL.

```text theme={null}
Set this folder up for HyperFrames and make me a video.

1. If the HyperFrames plugin is installed, use its bundled skills and launcher. If the HyperFrames skills are missing, stop and tell me: I install them with npx hyperframes skills update
2. Then, using /hyperframes, make a 10-second product intro for https://example.com
3. Open the local preview when it is done and tell me the project folder.
```

### Step by step

**1. Install the plugin or skills**

Step-by-step pages: [Claude Code](https://hyperframes.heygen.com/guides/with-claude-code.md), [Codex](https://hyperframes.heygen.com/guides/with-codex.md),
[Cursor](https://hyperframes.heygen.com/guides/with-cursor.md).

For Claude Code, Copilot, VS Code, Cursor, or Gemini CLI, start with the
[plugin installation guide](https://hyperframes.heygen.com/guides/plugins.md). It includes update settings for each agent. Claude's plugin entry
skill is `/hyperframes:hyperframes`.

For standalone skills, run this in your project folder, choose **Core Skills** in the picker, then open or
restart your agent in that folder:

```bash theme={null}
npx skills add heygen-com/hyperframes
```

**2. Ask for the video**

```text theme={null}
Using /hyperframes, make a 10-second product intro for https://example.com.
```

Replace `https://example.com` with the page you want the video to show. For a longer film that tells a story, the
agent first offers three storylines to pick from.

**3. Continue from the first version**

The agent leaves you with a project folder and opens its preview in the browser editor. To reopen it later, run
`npx hyperframes preview` in the project folder. All three paths below work on the same project.

## In an AI chat, nothing to install

In Claude.ai or ChatGPT, the HyperFrames connector builds and renders the video in your HeyGen account. You give up
the project folder and local rendering. [Connect HyperFrames to an AI chat](https://hyperframes.heygen.com/guides/mcp.md).

## Related topics

> [card] [Choose what to make](https://hyperframes.heygen.com/workflows.md)
>
> Product launch, explainer, captions, recut, pull request, music, motion graphic, or presentation.

> [card] [Continue from Claude Code in the app](https://hyperframes.heygen.com/studio-app/existing-project.md)
>
> Open a project your agent made in the Studio app, and hand it back.


## Related topics

- [Make your first video in the Studio app](https://hyperframes.heygen.com/studio-app/first-video.md)
- [Make videos with Cursor](https://hyperframes.heygen.com/guides/with-cursor.md)
- [Make videos with Codex](https://hyperframes.heygen.com/guides/with-codex.md)


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.