# Minty Sae-wink · site report

Continuation after merged PR #2. This is not an all-sites-live claim.

## Commits tested

| Tree | Commit | What was exercised |
| --- | --- | --- |
| `sae-anewgam` `main` | `347f4cc7b0e780133ab91e86e2eba7fe8fe9d3b3` | Merged root mount. Public production serves this eye. |
| `sae-anewgam` `cursor/sae-wink-sites-e3db` | `2c2249fab6d707f9eec3c309f33883af5d439a0f`, then the commit that adds this report and the `/in/gam` route-tree fix | Steven thread reader, 15 unit checks, 17 isolated browser checks, dev and built app smoke. |
| GitHub Pages doors | `7d4854b88a453a4272183033dc2cf177df734526` | Published Peachfall and Steven copies of the pre-reader module. |
| isliv | `68e57e07506c47e52a18efde51a03bd31d61619f` | Colour door only. Not modified. |

Approved sprite git blob: `a149db36e6ebaca4435fc2dee8fd2ee5c51d6fdf`.
Module git blob on `347f4cc7` and on the public doors: `cb9e590cba8c648e2885318bd393a0bc15e38b95`.

## Per site

| Site | State | Evidence |
| --- | --- | --- |
| sae-anewgam | **integrated** | Root `SaeWink` on every existing route, including `/`, `/fallen`, `/layers?img=/peachfall-walk.jpg`, and `/ball?stay=1`. No chat composer in this app, so the bubble stays **Local draft · not sent** and the Grok-copy action stays explicit. Clicking it did not emit `sae-wink`. Public routes without a sign-in wall: `https://sae-anewgam.vercel.app/` and `https://sae-anewgam-live.vercel.app/` (HTTP 200, one `sae-wink`, local draft). |
| Peachfall Playable, published door | **integrated** | `https://stevoblevo.github.io/peachfall/` and `play.html` self-host `./sae-wink/` and call `mountSaeWink({ world: "peachfall", saveKey: "peachfall-playable-v1" })`. There is no chat composer in that world (`#dialogue` is story text), so the live bubble opens **Local draft · not sent**. Gift flags in `peachfall-playable-v1` match `src/game/state.ts`. A fresh visit reports 0 marks. |
| Peachfall Playable, private source | **staged** | `stevoblevo/peachfall-playable` `index.html` and `play.html` do not mount the eye. The shared reader lives in this repo. It was not copied into that private repo: a text upload can corrupt the sprite, and this turn does not publish a destination. A rebuild from that source can drop the Pages mount. |
| Steven cockpit | **integrated** on the public door; thread count **staged** | `https://stevoblevo.github.io/anewgam-for-steven-cockpit/` focuses the existing `#dropInput` on `sae:chat-request` and does not open the local draft. The live call does not pass `anewgam.steven.cockpit.v2`, so the mark stays 0. This branch's reader counts `threads` whose `source` is a string (not blooms or receipts) and listens for the cockpit's existing `anewgam:state`. That reader is not on the live door. A local fixture with two held threads focused `#dropInput`, left the dialog closed, and did not emit `sae-wink`. |
| Polylite | **blocked** | Private, local-only, no Pages and no Vercel (`SECURITY.md`, `README.md`). Companion is Lumi ("not a second Sae"). Save key `polylite-save-v0` is understood by the reader and is not mounted. |
| Meema | **blocked** | No Meema repository. `https://anewgam-for-meema.stevoblevo.chatgpt.site/` is a separate Next site, CSP `script-src 'self'`, zero `sae-wink` elements. "Meema-eyes" is words only and does not open a camera. Nothing was injected. |
| isliv soft door | **not a wink host** | `https://stevoblevo.github.io/isliv/` and `https://isliv.vercel.app/` stay a colour test. Zero wink elements. Tower Docker was not built or pushed: this session has no Docker, and the existing `Dockerfile` still serves this app on 4180 when someone builds it. No new host. |

## Checks on `2c2249f` and the route-tree follow-up

- `node --test scripts/test-sae-wink.mjs`: 15 passed, including the sprite blob.
- `scripts/test-sae-wink-browser.py`: 17 passed under strict CSP.
- `npm run typecheck`: passed after `src/routeTree.gen.ts` caught up with the existing `/in/gam` route. That route file was already on main; the generated tree had been stale.
- `npm run build`: passed. Built files include `sae-wink.js` and the sprite.
- Dev `http://127.0.0.1:8080/` and built `http://127.0.0.1:8081/`: visible home text, no console errors, no horizontal overflow. Desktop body text matched. The first built mobile snapshot was shorter because the existing camera-consent sheet hydrates a moment later; a later read of the same built page includes that sheet and the eye at 76×76 inside the 390×844 viewport.

## Signed-in preview

The old feature preview `https://sae-anewgam-git-sae-minty-wink-20260927-skein1.vercel.app/` still answers **302** to Vercel SSO. No authorized session was available, and the wall was not bypassed. Public production and the GitHub Pages doors above did not ask for sign-in.

## Rollback

- This follow-up: revert the branch commits. The live Steven and Peachfall Pages doors are unchanged by it.
- The merged eye: revert `347f4cc7`, or remove the `SaeWink` import and mount in `src/routes/__root.tsx`.
- Pages doors, if they must come down later: revert GitHub Pages `7d4854b`. That was not done here.

## Holds

No Saedo acceptance was invented. No protocol bind was installed. No Immich UI. No destination deploy. `sae://on.lyphanGETouai.ly` remains a symbolic alias in the handoff. It is not a registered protocol handler, and `/anew` is not an HTTP route.
