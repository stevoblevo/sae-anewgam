# /anew · Minty Sae-wink · Dora handoff

## Exact scope

Candidate in the existing `sae-anewgam` project, based on main
`bde44408ca7cc243026e4db213f73e6d6a21ba62`. One `SaeWink` root mount serves
all existing routes, including the Peach Ball, in.gam, well, layers and ci
surfaces. This is not a new app, a second work queue or a completed deployment.

The viewer's approved mint/aqua eye art is vendored in
`public/sae-wink/sae-wink-sprite.webp`: 96x192, open above closed, transparent
outside. It is a small web derivative of the approved on/off PNGs, not new art.
Git blob: `a149db36e6ebaca4435fc2dee8fd2ee5c51d6fdf`.

## Fungi approach

Use one shared component with small per-world adapters. Keep each world's
scene, art, save origin, return path and privacy boundary. The current adapter
reads only the count from existing `readFlow()` and listens to `sae-flow`.
It neither writes that flow nor creates a canonical Skein receipt. Route
context deliberately excludes search strings, fragments and camera data.
Other origins do not share browser storage automatically.

On activation, `sae:chat-request` lets a host open its existing composer.
A handler may preventDefault only when it handles the UI. This is NOT a
Saedo acceptance receipt. Without a handler, the bubble opens a clearly
labelled local draft with a user-initiated Grok-copy action; it sends nothing.
Drafts are in memory, not durable work. There is no invented agent reply.

CRITICAL: Existing `Eye` subscribes to `sae-wink` for camera snapshots.
The new component NEVER emits that event. Decorative animation is CSS only.
The hold/wake control pauses decoration; it does not control the old camera.
Existing camera consent and behavior are unchanged, not audited as repaired.

`sae://on.lyphanGETouai.ly` is preserved as the owner's symbolic alias.
`/anew` is the handoff label here, not a newly installed HTTP route.
Neither is registered as a native protocol or claimed to be live.

## Grok ask — continue in the current project

Incorporate the approved Sae-wink into this existing Anewgam/Peachfall project.
Do not scaffold another app, generate another face, or replace the current art.
Use `public/sae-wink/` and the root adapter in `src/components/sae-wink.tsx`.
One mint eye, shared across the world's routes; transparent outside, aqua eye,
2.6 seconds open then a 0.16-second wink, quiet at reduced motion, visible in
fullscreen, accessible by keyboard and touch. Preserve the exit and saves.

Use the fungi approach: shared implementation, world-specific context and
return paths, no new queue. Reuse a real existing chat composer through
`sae:chat-request`; otherwise retain the explicit local-draft fallback. Never
claim a copy, UI-open event or animation means connected, submitted or done.
Never couple the bubble to `sae-wink`, camera, mic, recording or auto-send.

Apply the same vendored module to the existing Peachfall Playable, Polylite,
Steven and Meema surfaces only after reading their current source and privacy
rules. Self-host these files; do not add a live cross-origin CDN dependency.
Do not publish private video, webcam crops, local machine addresses or records.
Do not create another repository, hosting project or public domain.

Read the current AGENTS/project instructions in the actual Grok workspace.
Run existing typecheck/build and component checks there. Preserve the current
startup and publication contracts. Show the running project's actual mobile
and desktop captures; record exact source commit, tests, route and rollback.
Report each site as integrated, staged or blocked. Do not report all sites live
from a root mount in one project. Saedo/Skein acceptance remains separate.

## Checks and rollback

`node --test scripts/test-sae-wink.mjs` covers the small event/context unit
fixture and exact asset identity. `scripts/test-sae-wink-browser.py` exercises
the isolated browser component under strict CSP; this is not the full app.
The PR workflow runs both with read-only repository permissions.

At authoring, 10 local unit tests and JS syntax passed. Local browser navigation
was blocked by administrator policy; no local browser pass or screenshot is
claimed. Read the actual PR workflow outcome before promotion. Full app build,
independent review and deployed route checks are still required.

Rollback the feature commit, or remove its single root mount and import.
No original art, application route, dependency, save or camera module was changed.

## After merge `347f4cc7`

PR #2 is merged. The continuation record is `docs/SAE_WINK_SITE_REPORT.md`.
That report is per site. A root mount in this project is not a claim that
every Peachfall world is live. `sae://on.lyphanGETouai.ly` is still only a name.
