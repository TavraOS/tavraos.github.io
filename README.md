# TavraOS Website

Static public website for Tavra, an AI phone operations system for restaurants.

## Project Details

- Local path: `/Users/weshager/Desktop/Codejects/AIAnsweringService/website`
- Production/fallback URL: `https://tavraos.github.io/`
- Expected custom domain: `www.tavraos.com`
- GitHub Pages repository: `https://github.com/TavraOS/tavraos.github.io.git`

## Editing Locally

Edit the static files directly:

- `index.html`
- `styles.css`
- `script.js`
- `assets/`

The site is plain HTML, CSS, and JavaScript. It should work directly from GitHub Pages static hosting and does not require a React, Vite, Next, Heroku, backend, Parse Cloud Code, or iOS build pipeline.

To preview locally:

```bash
cd /Users/weshager/Desktop/Codejects/AIAnsweringService/website
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Committing and Pushing

Before committing or pushing, verify that the repo and remote are safe:

```bash
pwd
git status
git remote -v
```

The only allowed remote is `TavraOS/tavraos.github.io`.

Then commit and push:

```bash
git add index.html styles.css script.js assets WEBSITE_DEPLOYMENT_CONTRACT.md README.md
git commit -m "Initial TavraOS website"
git push origin main
```

## Safety Warning

The Hagerlabs website at `https://www.hagerlabs.com` is completely separate.

Never clone, edit, commit to, push to, reconfigure, or otherwise interact with the Hagerlabs GitHub Pages repository from this project.

Always read `WEBSITE_DEPLOYMENT_CONTRACT.md` before making website changes.
