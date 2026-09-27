# QVAC Fortune Cookie Message Maker

Enter an optional theme or mood (or leave blank for a random one), and an on-device AI writes a short fortune-cookie-style message. No cloud call, no API key.

## Run

```bash
npm install
npm start
```

Then open http://localhost:32040

## QVAC SDK version

`@qvac/sdk` ^0.19.0 (see `package.json`).

## How it works

Built on [Tether's QVAC SDK](https://www.npmjs.com/package/@qvac/sdk) — all inference runs on-device, no cloud call, no API key. The app loads `LLAMA_3_2_1B_INST_Q4_0` locally with `loadModel()`, generates with `completion()` (streamed via `tokenStream`), and releases the model with `unloadModel()` on shutdown.

Type an optional theme or mood and submit — or leave it blank. The server sends the model a short system prompt plus two few-shot examples, one themed and one with no theme, so it learns both modes. The streamed reply is trimmed of preamble and quote marks and checked for refusal phrases. If it looks unusable, a themed fallback sentence is built from your input, or a random line from a small built-in pool of general fortunes is shown when no theme was given.

**Example**

- Input: `career`
- Output: "A bold decision at work will open a door you didn't know existed."
- Input: *(blank)*
- Output: a random line such as "Your hard work is about to pay off in an unexpected way."

## License

MIT
