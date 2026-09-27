# Sae · .anewgam — pre-alpha play

Grok Build preview is transient. The baked image is the play door.

## Open (Steven, Tower, phone on LAN)

```bash
docker pull ghcr.io/stevoblevo/sae-anewgam:latest
docker run --rm -p 4180:4180 ghcr.io/stevoblevo/sae-anewgam:latest
```

Then open `http://<this-machine>:4180/` · `sae://on#kk`

Compose, same port:

```bash
docker compose up --build
```

## Hook from Grok Build (sieve the late transient)

Sandbox serves `0.0.0.0:8080` via `startup.sh` + `npm run dev`.
When that host dies, pull GHCR. Do not invent a second project. Do not import Vercel again.

Clock: `public/4gg.tim` · still / side / rise / group / pass · 4.2
Egg: `public/bespokegg.json` · `bespokegg/0.1` · authorityEffect none

## Not this image

Private polylite stays loopback. No CA. Companion is the small one.
