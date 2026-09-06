Run the browser checks against the production build:

```sh
npm ci
npx playwright install chromium webkit
npm run build
npm run test:e2e
```

The suite covers first paint with JavaScript held back, video playback and
completion, skipping and replaying, reduced motion, and JavaScript disabled.
It runs in desktop Chromium and WebKit with an iPhone viewport.

To check a deployed version, set `PLAYWRIGHT_BASE_URL` to its URL; the suite
will use that site instead of starting the local production server.
