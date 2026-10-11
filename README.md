# Little Learners – Tamil & English
Free, offline-first PWA for ages 3–5. Plain HTML/CSS/JS + JSON. No tracking, ads, login or network APIs.
## Run locally
`cd kids-learning-app && python3 -m http.server 8080` → open http://localhost:8080 (service workers need localhost or HTTPS; double-clicking index.html won't work).
## Offline test
Open once online → DevTools › Application › Service Workers → tick Offline → reload. Then try "Install".
## Add content
Edit `data/content.json`: add rows to `pools` (`[letter,emoji,name]` or `[letter,emoji,tamil,english]`) and activities under `cats[].acts` (types: learn, quiz, count, seq, memory). UI text lives in `ui` (en/ta). Bump `V` in service-worker.js after changes.
## Deploy (free)
Push to GitHub › Settings › Pages › deploy from branch. Paths are relative, so repo subpaths work. Open the HTTPS URL, wait for caching, go offline, test.
## Privacy
Stores only language, level, sound/motion settings and completed activity IDs in localStorage (`kids-learning-app-settings-v1`). Nothing is transmitted.
## Limitations
Illustrations are system emoji (no bundled art/audio); read-aloud uses the device's speech voices if present (a Tamil voice may be missing). **Tamil content needs review by a fluent speaker before release.**
