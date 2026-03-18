# Gemini Local Setup — NomNomSafe

Follow these steps to get your local environment configured to use the Gemini AI integration added in Sprint 2.

---

## Step 1 — Get a Gemini API Key

1. Go to [aistudio.google.com](https://aistudio.google.com) and sign in with a Google account
2. Click **"Get API key"** in the left sidebar
3. Click **"Create API key"** → **"Create API key in new project"**
4. Copy the key — you won't be able to see it in full again after closing the dialog

---

## Step 2 — Add the Key to Your .env File

In the `server/` directory, open `.env` (or create it if it doesn't exist — it is gitignored and will not be present after cloning).

Add the following two lines:

```
GEMINI_API_KEY=your_api_key_here
LLM_PROVIDER=gemini
```

Replace `your_api_key_here` with the key you copied in Step 1.

> **Never commit your .env file.** It is already in .gitignore. If you accidentally expose your key anywhere (chat, GitHub, etc.), delete it in AI Studio and create a new one immediately.

---

## Step 3 — Install the New Server Dependency

The Gemini SDK was added as a server-side dependency. After pulling the latest code, run:

```bash
cd server
npm install
```

This will pick up `@google/genai` which was added to `server/package.json`.

> Make sure you are in the `server/` directory specifically — not the project root.

---

## Step 4 — Verify It Works

Start the server as normal. If your key is missing or invalid, any request to the import endpoints will return a clear error message. No other parts of the app are affected if the key is absent.

---

## Free Tier Limits (FYI)

You are on Google's free tier, which requires no credit card. Current limits for `gemini-2.5-flash`:
- 10 requests per minute
- 250 requests per day

This is more than sufficient for development and demo usage.
