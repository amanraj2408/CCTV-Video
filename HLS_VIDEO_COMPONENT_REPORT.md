# Video Dashboard — Project & HLS Component Report

**Date:** January 5, 2026

This document summarizes the full project located at the repository root, highlights the [HlsVideo component](src/app/components/HlsVideo.jsx), provides run/build instructions, maps key files, and lists recommendations for testing, CI, and improvements.

---

**Quick summary:** This is a Next.js (app router) dashboard for multi-stream HLS playback and monitoring. It uses `hls.js` for non-Safari playback and a custom `HlsVideo` client component for each stream. The project is set up for local development with standard Next scripts.

---

**Tech stack & key dependencies**

- `next` 16.x (app router)
- `react` / `react-dom` 19.x
- `hls.js` ^1.6.15 (HLS playback fallback)
- `tailwindcss` (styling)
- `eslint` (linting)

See `package.json` for exact versions: [package.json](package.json)

---

**Run / development**

1. Install dependencies:

```bash
npm install
```

2. Run development server:

```bash
npm run dev
# app available at http://localhost:3000
```

3. Build for production:

```bash
npm run build
npm run start
```

Notes: Next uses the app router. If you use a different package manager, the [README.md](README.md) includes alternatives.

---

**Project layout (important files)**

- App entry: [src/app/page.js](src/app/page.js) — dashboard UI and stream grid
- Root layout: [src/app/layout.js](src/app/layout.js)
- HLS component: [src/app/components/HlsVideo.jsx](src/app/components/HlsVideo.jsx)
- Config: [next.config.mjs](next.config.mjs), [jsconfig.json](jsconfig.json)
- Documentation: [README.md](README.md)
- This report: [HLS_VIDEO_COMPONENT_REPORT.md](HLS_VIDEO_COMPONENT_REPORT.md)

---

## `HlsVideo` component — concise analysis

Location: [src/app/components/HlsVideo.jsx](src/app/components/HlsVideo.jsx)

Purpose: Client-side React component that plays an HLS stream. It picks native playback for browsers that support `application/vnd.apple.mpegurl` and uses `hls.js` for others.

Key behaviors:
- Validates `src` and shows a loading spinner and error overlay.
- Uses a default `hls.js` config optimized for low-latency/live playback; accepts `hlsConfig` to override.
- Handles common `hls.js` events: `MANIFEST_PARSED`, `BUFFER_APPENDED`, and `ERROR` and implements recovery strategies (network retry, `recoverMediaError`).
- Cleans up `hls.js` instance on unmount and clears native `video.src` when using native playback.

Props (short):
- `src: string` (required) — m3u8 URL
- `label: string` — UI/log label
- `onReady: function` — callback with `HTMLVideoElement`
- `autoplay: boolean` — attempt autoplay when ready
- `hlsConfig: object` — merged with default config

Known strengths:
- Robust error handling and recovery attempts
- Proper cleanup to avoid leaks
- Good UI feedback for loading/errors

Quick recommendations for the component:
- Add `aria-label` for accessibility and optional captions support.
- Consider exposing more `hls.js` events via callbacks for monitoring.
- Add unit and integration tests (mount, manifest parsed, error recovery, unmount cleanup).
- Install `prop-types` if not present (`npm install prop-types`).

---

## Notable code observations (from scanning files)

- [src/app/page.js](src/app/page.js) mounts multiple `HlsVideo` instances and coordinates play/pause across them (see multi-play helpers like `startTogether`). This is a small dashboard that demonstrates simultaneous streams.
- `HlsVideo.jsx` uses `useEffect` keyed on `[src, label]` — verify whether other props (e.g., `hlsConfig`, `autoplay`) should be included in dependencies if runtime changes are expected.
- [jsconfig.json](jsconfig.json) maps `@/*` to `./src/*` which simplifies imports.

---

## Suggested tests & CI

Suggested test coverage:
- Unit tests for `HlsVideo` render states (loading, error, normal)
- Mock `video` element `canPlayType` to test native vs `hls.js` branches
- Simulate `hls.js` events (MANIFEST_PARSED, ERROR) to verify state transitions
- Ensure `hls.destroy()` called on unmount

CI hints:
- Add GitHub Actions to run `npm ci`, `npm run lint`, and unit tests.
- Optional: Lighthouse or Playwright checks for basic page load and video presence.

---

## Deployment & monitoring tips

- If deployed to Vercel, configure streaming backends and CORS for media endpoints.
- For production live streams, ensure the HLS origin supports low-latency parts if `lowLatencyMode` is used.
- Add metrics for stream health (manifest load time, error rates) and display them in the dashboard.

---

## Next steps I can do for you

1. Add unit tests for `HlsVideo` (Jest + React Testing Library)
2. Add a basic GitHub Actions CI workflow (install, lint, test)
3. Convert `HlsVideo` to TypeScript (optional)
4. Add an accessible play button fallback for autoplay-restricted browsers

Tell me which of these you'd like me to start with and I will implement it.

---

**End of report**
