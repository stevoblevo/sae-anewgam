# Sae · .anewgam — pre-alpha play

Grok Build preview is transient. The baked image is the play door.
PWA already lives in the image: `sw.js` + `/__grok/manifest.webmanifest` + Install sheet.

## Easy deploy (Steven / Tower / phone on LAN)

```bash
sh deploy.sh
# or
docker pull ghcr.io/stevoblevo/sae-anewgam:latest
docker run --rm -p 4180:4180 ghcr.io/stevoblevo/sae-anewgam:latest
```

Open `http://127.0.0.1:4180/` · `sae://on#kk`

Compose (pull or rebuild):

```bash
docker compose pull && docker compose up -d
# or local bake: docker compose up --build -d
```

## PWA

On **localhost:4180** the browser can Install / Add to Home Screen.
On a LAN IP, most browsers need HTTPS for the install prompt — use Share → Add to Home Screen, or open via `http://tower.local:4180` after `/etc/hosts`.
Leave is always on top. Picture fills. Words off the controls.

## Hook from Grok Build (sieve the late transient)

Sandbox serves `0.0.0.0:8080` via `startup.sh` + `npm run dev`.
When that host dies, pull GHCR. Do not invent a second project. Do not import Vercel again.

Clock: `public/4gg.tim` · still / side / rise / group / pass · 4.2
Egg: `public/bespokegg.json` · `bespokegg/0.1` · authorityEffect none

## Not this image

Private polylite stays loopback. No CA. Companion is the small one.
