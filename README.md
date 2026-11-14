# I Am Not Saying — A Machine for Synthetic Expression

Generative text and voice piece: a local model writes a short philosophical text, then you draw it in space with your mouth or the mouse. Letters fade and float like bubbles. The voice plays in sync as you draw.

Text is written by Gemma 4 through Ollama on this computer. English is spoken by Kokoro. The other languages in the menu are spoken by Supertonic 3. Nothing is sent to an external model, and no API key is required.

Mouth tracking is unchanged: open your mouth to draw, close it to stop. The local-AI wiring follows [Machine Forgetting](https://github.com/marlonbarrios/machine_forgeting_localai), which uses the same Gemma, Kokoro, and Supertonic stack with a hand pinch instead of the mouth.

## Run it

Ollama must already be running, with `gemma4:latest` installed. Node 22 or newer.

PowerShell on this machine blocks `npm.ps1`. Use one of these:

```bat
node server.js
```

```bat
npm.cmd run dev
```

Then open **http://localhost:5175**. Allow the camera when the browser asks.

Chrome and Edge can install that page as an app. Open Controls and choose **Install app**, or use the install icon in the address bar. The installed window is still this local page: the terminal and Ollama have to keep running.

```bat
node chrome-app.js
```

or double-click `app.cmd`. That starts the server and opens the piece in a Chrome window with no tabs.

The first launch loads Kokoro and Supertonic. Later runs reuse the weights already on disk. Supertonic runs in its own process so it does not clash with Kokoro. The Supertonic weights in `models/supertonic-3` point at the copy already downloaded for Machine Forgetting.

If 5175 is taken, the server tries the next port and prints the URL.

Optional `.env` overrides (see `.env.example`):

```bash
OLLAMA_HOST=http://127.0.0.1:11434
OLLAMA_MODEL=gemma4:latest
KOKORO_VOICE=af_heart
SUPERTONIC_VOICE=F1
SUPERTONIC_STEPS=8
PORT=5175
```

## Controls

| Action | Result |
|--------|--------|
| **Space** | Start a new text every 30 seconds. Press again to stop. |
| **Escape** or **home** | Return to the home page and stop the texts. |
| **Open mouth** or **click and drag** | Draw the text; the voice plays in sync |
| **Move up and down** | Volume |
| **Move faster** | Playback rate and letter size |
| **C** | Show or hide the color camera thumbnail. The mouth keeps tracking either way. |
| **T** | Draw on top of the camera |
| **Backspace / Delete** | Clear the drawing |
| **S** | Save the canvas as a PNG |
| **Arrow up / down** | Angle of the letters |

## Models

| Use | Engine |
|-----|--------|
| Text, `/api/chat` | Ollama `gemma4:latest`, thinking off |
| English speech | Kokoro (`af_heart`) |
| Spanish, French, Portuguese, Korean, German | Supertonic 3, voice `F1` |
| Mouth | MediaPipe face landmarker |

The menu is those six languages. A color thumbnail of the webcam sits at the bottom left. If another window already has the camera, or permission is blocked, the page says so.

## If something fails

- **`npm.ps1 cannot be loaded`**: run `node server.js` or `npm.cmd run dev`.
- **Ollama is not running**: start the Ollama app, then press Space again.
- **Wrong piece on screen**: 5173 is My LatentWelt and 5180 is Machine Forgetting. This piece is **http://localhost:5175**.
- **Camera denied or in use**: close the other window that holds the webcam, then reload.
- **MediaPipe logs** (OpenGL, TensorFlow Lite): normal face-tracking noise.
