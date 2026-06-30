# Task 1 — Language Translation Tool ("Lingo Desk")

A browser-based translation tool. No build step, no install — just open `index.html`.

## Files
- `index.html` — markup and structure
- `style.css` — visual styling
- `script.js` — language list, API calls, UI logic

## Preview
![Index Card translator screenshot](screenshot.png)

## How it satisfies the brief
| Requirement | Where it's handled |
|---|---|
| User interface for text entry + source/target language selection | `index.html` text area + two `<select>` dropdowns, populated from `LANGS` in `script.js` |
| Translation API integration | `script.js` calls the free MyMemory Translated API (`api.mymemory.translated.net`) — no API key required |
| Send text, get translated response | `fetch()` call on the Translate button click handler |
| Display translated text clearly | Rendered into the right-hand pane (`#outputText`) |
| Optional: copy button | `#copyBtn` copies the translation to the clipboard |
| Optional: text-to-speech | `#speakSrcBtn` / `#speakTgtBtn` use the browser's built-in `SpeechSynthesisUtterance` |

## Swapping in Google Translate API / Microsoft Translator
MyMemory is used here because it's free and requires no signup, which keeps the demo self-contained. For production use, replace the `fetch` URL inside `script.js` with a call to Google Cloud Translation API or Microsoft Translator, and add your API key as a header or query param (don't hardcode keys in client-side JS — proxy the request through a small backend instead).

## Known limits
- MyMemory's free tier is rate-limited (around 5,000 words/day per IP) — fine for demos, not for production traffic.
- Text-to-speech voice quality/availability depends on the browser and OS.
