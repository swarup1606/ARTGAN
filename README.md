# ARTGAN – AI-Powered Artwork Restoration

ARTGAN restores damaged artwork and old photographs in a browser. The React app is the interface. The AI models run in Google Colab because they require GPU resources.

## Project Preview

<p align="center">
  <img src="ARTGAN IMAGES/Home.jpg" alt="ARTGAN Homepage" width="49%">
  <img src="1.jpg" alt="ARTGAN GAN Restoration Result" width="49%">
</p>

<p align="center">
  <em>ARTGAN Web Interface and AI-Powered Image Restoration</em>
</p>

## Features

Two restoration modes are included:

- **GAN Restoration:** Uses Microsoft's [Bringing Old Photos Back to Life](https://github.com/microsoft/Bringing-Old-Photos-Back-to-Life). The notebook serves it through FastAPI and a temporary ngrok URL. The website uploads an image and displays the restored result.
- **Stable Diffusion:** Uses `runwayml/stable-diffusion-inpainting` in a Gradio app. Choosing this mode opens that app inside the website.

Sample photos live in the [`ARTGAN IMAGES`](ARTGAN%20IMAGES) folder. Use them to try an upload before using your own files.

## Requirements

- [Node.js](https://nodejs.org/) 18 or newer
- A Google account that can run a Colab **GPU** runtime (T4 is enough)
- A free [ngrok](https://dashboard.ngrok.com/signup) account, for the GAN API
- A [Hugging Face](https://huggingface.co/) account, for the Stable Diffusion weights

The website can run on your computer. The notebooks need a Colab GPU to run effectively.

## Repository Layout

```text
ARTGAN/
├── assets/
│   ├── homepage.png
│   └── restoration-result.png
├── frontend/                 React + Vite website
├── LatestGAN.ipynb           GAN restoration API (Colab)
├── Stable_Diffusion.ipynb    Stable Diffusion Gradio app (Colab)
└── ARTGAN IMAGES/            Sample photos for upload
```

## 1. Run the Website

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

On Windows PowerShell:

```powershell
cd frontend
Copy-Item .env.example .env
npm install
npm run dev
```

Open the local address Vite prints, usually `http://localhost:5173`.

Leave `.env` empty until the Colab notebooks print their public URLs. After you paste those URLs, stop the dev server and run `npm run dev` again. Vite only reads `.env` at startup.

`.env` is listed in `.gitignore`. Do not commit it.

## 2. Start the GAN API

1. Open [Google Colab](https://colab.research.google.com) and upload `LatestGAN.ipynb`.
2. Set the runtime to **GPU**: Runtime → Change runtime type → T4 GPU.
3. In the last code cell, replace `YOUR_NGROK_AUTHTOKEN` with the token from [ngrok authtoken](https://dashboard.ngrok.com/get-started/your-authtoken). Keep that token in the Colab notebook only. Do not commit it.
4. Run the cells from the top, in order, through the checkpoint check and the two cells marked `FIX`. Those cells mount Google Drive, clone the Microsoft repository into `MyDrive/OldPhotoRestoreProject`, install dependencies, and download the model files.
5. Skip the cell that calls `files.upload()` unless you want to test a single image inside Colab. That cell waits for a manual upload and will stop a "Run all".
6. Run the cell that installs `pyngrok`, `fastapi`, and `uvicorn`.
7. Run the final cell, **Old Photo Restoration | FastAPI + ngrok Server**. Leave that cell running.

The cell prints a line like:

```text
API URL: https://something.ngrok-free.dev
```

Put that URL in `frontend/.env`:

```text
VITE_GAN_URL=https://something.ngrok-free.dev
```

Restart `npm run dev`. On the Upload page, choose **GAN (Fast)** and click **Start Restoration**. The first image can take about 30 to 60 seconds.

The ngrok address changes every time you restart Colab. Update `.env` when it changes. Closing the notebook or letting Colab disconnect stops the API.

## 3. Start Stable Diffusion

1. Upload `Stable_Diffusion.ipynb` to a second Colab session with a GPU runtime. One free Colab GPU session is often all you can keep open, so you may need to stop the GAN notebook first.
2. Run all cells. The first cell installs the pinned `diffusers` and `transformers` versions. The next cell loads `runwayml/stable-diffusion-inpainting` and starts Gradio with a public link.
3. If Hugging Face refuses the download, open the model page, accept its license, then log in from Colab with a [Hugging Face access token](https://huggingface.co/settings/tokens).

Gradio prints a link such as `https://something.gradio.live`. Put it in `frontend/.env`:

```text
VITE_SD_GRADIO_URL=https://something.gradio.live
```

Restart `npm run dev`. On the Upload page, choose **Stable Diffusion**. The Gradio app opens in a window. Upload the image there and use its Generate control. That share link expires after about a week, and it dies as soon as the Colab session stops.

## Try It With the Sample Images

The files in `ARTGAN IMAGES` are damaged or low-quality samples meant for upload:

| File | What it is |
|---|---|
| `0001.jpg` | Small sample photo |
| `2_damage.jpg.jpeg` | Damaged photograph |
| `b.png`, `c.png`, `d.png` | Artwork samples |
| `crack5.png` | Cracked artwork |
| `global.png` | Larger sample |
| `HR.png`, `HR_result.jpeg` | Higher-resolution input and a previous result |

The Upload page accepts JPG, PNG, and WEBP up to 10 MB. Pick one of these files, or use your own image.

## What to Expect

- GAN restoration is requested from this website and the restored image is shown on the same page.
- Stable Diffusion restoration happens inside the Gradio window.
- Both backends must stay running in Colab while you use them.
- A GPU runtime is required. CPU runtimes will fail or be too slow to be useful.

## Security

Never commit an ngrok token, a Hugging Face token, or `frontend/.env`. If a token was saved in a notebook, chat, or screenshot, revoke it in the ngrok or Hugging Face dashboard and create a new one.

## Credits

- GAN pipeline: [microsoft/Bringing-Old-Photos-Back-to-Life](https://github.com/microsoft/Bringing-Old-Photos-Back-to-Life)
- Inpainting model: [runwayml/stable-diffusion-inpainting](https://huggingface.co/runwayml/stable-diffusion-inpainting)
