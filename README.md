# My precious 💗

A little love website: our story, photos, open-when letters, reasons, love coupons, a mini game, and a secret message.

## Project structure

```
index.html                  page markup only
css/
  base.css                  colors, fonts, reset, buttons, animations
  layout.css                nav, hero, sections, footer
  components/               one file per section (timeline, gallery, letters, …)
js/
  main.js                   entry point, connects data to components
  config.js                 password, hint, letter sign-off, hero lines
  data/                     ALL the text and photos, edit these
    timeline.js  photos.js  letters.js  reasons.js  coupons.js  pro.js  secret-letter.js
  components/               the logic for each section
  utils/                    small shared helpers
images/                     all photos
```

## Editing content
- **Story chapters**: `js/data/timeline.js`. Add `photos: ["photo-id"]` to show a photo in a chapter.
- **Photos**: put the file in `images/` (no spaces in the name) and add a line in `js/data/photos.js`.
- **Password / hint**: `js/config.js` (default password: `sushi`).

## Previewing locally
The JavaScript uses ES modules, so **double-clicking `index.html` won't work** (browsers block modules on `file://`).
In VS Code, install the **Live Server** extension, right-click `index.html`, and choose **Open with Live Server**.

## Put it online (GitHub Pages)
1. Create a new repository on GitHub (e.g. `my-precious`).
2. Upload everything in this folder (keep the folder structure).
3. Go to **Settings → Pages**, set Source to **Deploy from a branch**, branch `main`, folder `/ (root)`, and save.
4. After a minute your site is live at `https://<your-username>.github.io/my-precious/`.

Note: the password only hides the letter from casual visitors. Anyone who views the source can read it, and a public repo is visible to everyone.
