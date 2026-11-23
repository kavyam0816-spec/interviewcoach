# InterviewCoach — Mobile-ready GitHub Pages demo

A responsive, interactive front-end prototype for the InterviewCoach mock interview practice project.

## Files
- `index.html` — website page
- `styles.css` — styling and responsive layout
- `script.js` — interactive demo behavior
- `.nojekyll` — tells GitHub Pages not to run Jekyll processing

## Publish from an Android phone using GitHub

1. Download the ZIP and extract it using your phone's Files / My Files app.
2. Open Chrome and sign in to GitHub.
3. Open your repository: `https://github.com/kavyam0816-spec/interviewcoach.1`
4. Make sure the branch selector shows `main1`.
5. Tap **Add file** → **Upload files**.
6. Choose the extracted files: `index.html`, `styles.css`, `script.js`, `.nojekyll`, and `README.md`. Select the files themselves, not the ZIP and not the containing folder. If your phone's picker does not allow selecting multiple files, upload them one at a time using **Add file → Upload files**.
7. Scroll down and tap **Commit changes**. If GitHub asks whether to replace existing files, confirm the replacement for the matching website files.
8. Open the repository **Settings** → **Pages**. On mobile, you may need Chrome's three-dot menu → **Desktop site** to see all settings.
9. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
10. Set **Branch** to `main1` and folder to `/(root)`, then tap **Save**.
11. Wait for the Pages deployment to finish. Return to **Settings → Pages** and tap **Visit site** when it appears.

Expected Pages URL (verify it in Settings → Pages):
`https://kavyam0816-spec.github.io/interviewcoach.1/`

## Demo limitations
This is a static front-end demonstration. It does not connect to a live FastAPI backend, PostgreSQL database, mentor account system, or external AI API. Feedback is simulated locally and should be presented as sample/demo feedback, not real AI-generated assessment.
