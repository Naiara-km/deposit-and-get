# Deploying to GitHub Pages

Everything is wired — you only need to do **three things** once. After that,
every push to `main` auto-deploys via the `.github/workflows/deploy.yml`
GitHub Action.

The deployed URL will be:

```
https://naiara-km.github.io/deposit-and-get-prototype/
```

---

## 1. Create the repo on GitHub

Open https://github.com/new and create an empty public repo with:

- **Owner**: `Naiara-km`
- **Repository name**: `deposit-and-get-prototype`
- **Public** (so Maze testers can open it without a GitHub account)
- **Leave README / .gitignore / license empty** — they already exist locally

Click **Create repository**.

## 2. Push the local repo

From this folder, run:

```bash
git remote add origin https://github.com/Naiara-km/deposit-and-get-prototype.git
git branch -M main
git push -u origin main
```

The push triggers the GitHub Action that builds the site.

## 3. Enable Pages

In the new repo:

1. Go to **Settings → Pages**
2. Under **Build and deployment → Source**, choose **GitHub Actions**
3. (No other config needed.)

Wait ~60 seconds for the first build to finish (watch progress on the
**Actions** tab). When it's green, the URL above is live.

---

## How the deploy works

- `vite.config.ts` reads `BASE_PATH` from the env. CI sets it to
  `/deposit-and-get-prototype/` so absolute asset URLs resolve correctly
  under the GitHub Pages subpath.
- `src/main.tsx` uses **HashRouter** in production (URLs look like
  `…/#/promotions/spins-of-olympus`). Dev keeps the cleaner BrowserRouter.
  Hash routing means no server-side rewrites are needed — GitHub Pages
  serves a single `index.html` and the router handles the rest.
- `.github/workflows/deploy.yml` runs on every push to `main`:
  install → build with the right base → upload `dist` → publish to Pages.

## Iterating

Each change you push to `main` rebuilds and redeploys automatically. The
public URL stays the same. Maze test links don't need updating.

## If something fails

Open the **Actions** tab on GitHub, click the latest run, and read the
failed step's log. Typical issues:

- **404 on assets** — check that Pages settings show "GitHub Actions" as
  the source, not "Deploy from a branch".
- **Build error** — usually a TypeScript error. Run `npm run build`
  locally first to reproduce.
- **Pages not enabled yet** — first push will fail the `deploy` step
  before you enable Pages. Re-run the workflow after enabling, or push
  again.
