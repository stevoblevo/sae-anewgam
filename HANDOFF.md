# Sae · .anewgam — image and cleanup handoff

Paste this whole note into ChatGPT. Do not start a new aesthetic. Park new picture-making until the items below are done.

Repo (private): https://github.com/stevoblevo/sae-anewgam
Latest commit on `main` is already pushed. This is the source of truth.

## Run it on Tower, Blevitude, or any local machine

```bash
git clone https://github.com/stevoblevo/sae-anewgam.git
cd sae-anewgam
npm ci
npm run dev
```

Opens on `0.0.0.0:8080`.

Container, same port:

```bash
docker build -t sae-anewgam .
docker run --rm -p 8080:8080 sae-anewgam
```

The image runs the dev server on purpose so local work can continue. It is not a Vercel production build. Vercel was not successfully linked from this sandbox. Do not create a second project. If a Vercel project already exists for this repo, redeploy `main`. Do not import again.

## What this is

A scroll player. One full-bleed plate at a time. Stills live in `public/`. Motion lives in `public/motion/`. Each plate has its own quiet loop in `public/audio/scenes/<id>.mp3`. The catalog is `src/lib/plates.ts`. The player is `src/components/player.tsx`.

Casts, folded in the gallery: porch fight, peach ball, red rain, the well, say kirby. Shelf `later` and `study` are the folded **kept** drawer. Do not delete a plate to hide it. Move it to `shelf: "later"`.

## What is messy

- Too many near-duplicate faces. The cute purple stare is `public/cute.jpg` (plate `savannah`). The garden stare is `public/garden-stare.jpg` (plate `painted-stare`). Do not make another purple girl.
- `public/sae-reach.jpg` has words painted into the picture. It is parked on plate `reach-kept`. The live reach is `public/farther-well.jpg`, matched to the well (child and deer, no letters).
- UI words should dissolve. They are CSS, not part of the picture. New art must contain no titles, captions, or watermarks.
- Immersive mode used to trap the click. Exit is the solid dark circle (top right) and the Escape key. The bubbles and the film strip stay up so the picture can still be changed. If a button is too transparent to hit, make the hit target solid. Do not hide the exit.
- Music is a different soft loop per scene, not one bed. It is still simple. Do not put the same file on every plate.
- Speech is Microsoft Emily only, and only while that face is the full picture. If Emily is not installed, stay silent. Do not fall back to a default browser voice.

## Image task

Work only from plates that already exist. For each one: say if the still matches its cast, and if words are baked into the pixels.

1. Well family should look like `public/beat01.jpg` through `public/beat06.jpg` and `public/farther-well.jpg`. Child, deer, watercolor forest. No type.
2. Porch family should look like `public/garden-porch.jpg` and `public/cute.jpg`. Do not restyle the cute face into a new person.
3. Peach family should look like `public/bambi.jpg`, `public/anna.jpg`, `public/sisters.jpg`.
4. Say Kirby is `public/kirby.png` (the map) and `public/loom.png` (the loom room). The loom is the door. Peach fall and red rain are the two ways out. Leave the link on the map: https://anewgam-liqc.vercel.app
5. If a picture has letters in it, park that file on `shelf: "later"` and point the live plate at a clean still. Do not crop the words out by covering them with HTML.

## Navigation task

- One picture on screen. Crossfade. Do not stack captions.
- Play loops. A hidden plate may pop, then the next beat dissolves into it.
- Gallery shelves stay folded. Every still is in exactly one shelf.
- Semiotic controls are the bubbles and the rings, not sentences. Labels fade. Hover may show them.

## Do not

- Do not generate another face “just in case.”
- Do not remove art. Park it.
- Do not turn the rain noise back on.
- Do not restart from a blank app.
