
# Gripetime (Full Stack, GitHub-Ready)

This repository is ready to open in **GitHub Desktop** and deploy via **GitHub Actions** to **Firebase Hosting + Functions**.

## What's included
- React (Vite) web app in `/web`
- Firebase Hosting & Functions in the repo root + `/functions`
- Express API (`/api`) with Firestore for gripes/votes/comments
- Clean URLs via Hosting rewrites
- CI deploy with GitHub Actions

---

## One-time Setup

1) **Create Firebase project**
- Enable **Firestore** and **Authentication** (Email/Password). (Storage optional for now.)

2) **Update project id**
- Edit `.firebaserc` and set your Firebase project id.

3) **Add GitHub Action Secrets (Repo → Settings → Secrets and variables → Actions)**
- `FIREBASE_SERVICE_ACCOUNT` → paste full JSON from Firebase Console → *Service accounts → Generate new private key*
- `VITE_API_KEY`
- `VITE_AUTH_DOMAIN`
- `VITE_PROJECT_ID`
- `VITE_STORAGE_BUCKET`
- `VITE_MESSAGING_SENDER_ID`
- `VITE_APP_ID`

4) **Make yourself Admin**
- In Firestore, create doc at `admins/{YOUR_AUTH_UID}` (empty doc is fine).
- Get your UID by signing up on the live site or from Firebase Console → Authentication → Users.

---

## Local Dev

```bash
npm i -g firebase-tools

# Web app
cd web
npm install
cp .env.example .env
# open .env and paste firebase values
npm run dev   # http://localhost:5173

# Emulators (from repo root)
cd ..
firebase emulators:start
```

---

## Deploy
Just **commit & push to `main`**. The included workflow (`.github/workflows/firebase-hosting.yml`) builds and deploys Hosting + Functions.
