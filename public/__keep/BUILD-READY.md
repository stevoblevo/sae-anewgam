# BUILD-READY — Sae · .anewgam
Paste this whole file to Grok Heavy. Build on `sae/bpeace-20260927`. Do not merge main until Steven says.

## Who you are
You are continuing the EXISTING repo `stevoblevo/sae-anewgam`.
No new app. No new face. No replacement door.
Home already opens on `<Immerse>` (the potato). That is the film.

## Truth right now (2026-09-27)
Branches
- `main` @ 347f4cc — Minty Sae-wink merged. Production door: https://sae-anewgam.vercel.app
- `sae/minty-wink-20260927` @ c4afb9d — wink feature branch
- `sae/bpeace-20260927` @ 34a8e694 — riff checkpoint. BUILD HERE.
- `codex/pwa-install-scene-nav` @ 28a8926

PR #2 (Minty Sae-wink) is merged. Camera stays occult-off. Decorative wink ≠ capture.
Symbolic alias only: `sae://on.lyphanGETouai.ly` — do not claim a protocol handler is installed.

What is live in the house
- Immerse potato: `src/components/immerse.tsx` + `.potato` in CSS
- PRESENT 11: beauty sun light dawn red black whole obsidian reign knight glow (`src/lib/present.ts`)
- BPEACE marks + story (`src/lib/bpeace.ts`)
- Plates + casts porch/peach/rain/well/kirby/white (`src/lib/plates.ts`)
- Goal path laws (`src/lib/goal.ts`) door → peachfall → forest → noctalia → grotto → beyond
- Knight: step / beside / together. He never leads (`src/lib/knight.ts`)
- Glue gestures already SKIP `.immerse` and `.potato` (`src/components/glue.tsx`)
- Occult settings: wink blink capture faces, default all off (`src/lib/occult.ts`)
- PWA + sw.js + one Dockerfile
- Motion clips under `public/motion/` including farther-well, rain, gen2, gen4, gen22, sisters, porch
- Friend anchors already on disk: farther-well.jpg, pink-forest.jpg, leaf-deer.jpg, scroll-meet.jpg, weather.jpg, mark-orange.jpg, peachfall-walk.jpg, sisters-well.jpg, gen2.jpg, gen4.jpg, gen22.jpg

What is drafted, NOT live
- 2D wall roam both ways
- Open look / hand / zoom-as-scroll / next-back
- FRIEND_FILM second potato reel
- public/__keep/ hidden docs
- New founding stills (children + fawn + whole carrot) if minted this session — do not overwrite gen2/gen4/gen22 files

## Ethic
Meet, do not collect.
Fawn is GUIDE. Beside. Looks back. Never a mascot. Never scored.
Carrot stays WHOLE. Offer is the move. Eating would be a score.
Red is weather, not a fall, not a crown.
Play is a TAP. The film never runs itself.
Camera stays occult-off.
Two families, one house:
- well-children + spotted fawn = founding walk
- peach-cast older girls (gen2 / gen4 / gen22 / sisters / bambi) keep their own plates
Do not restyle children into the red-haired listener or the lilac woman.

## Color is meaning
peach  walk together / sisters
mint   rest / well / pink-inside
orange like / offer / whole carrot / door that likes you
red    weather
gold   play / light
obsidian way
white  mark / ring
lilac  you came
leaf   not a trophy

## Build order (do in this order, stop and show after each)

### 0. Lock (1h)
- Work only on `sae/bpeace-20260927`.
- Copy keep docs into `public/__keep/` unlinked. Do not put them in nav.
- Bump SW cache only when new media lands.
- Production Vercel stays the old door.

### 1. Easy-touch immerse (FIRST, this is the ask) (~6–8h)

Goal: the potato feels obvious on a phone. One plate. Native swipe. No stolen gestures. No autoplay.

Touch law
- On `.potato`: native `touch-action: pan-x` already. KEEP IT. Glue already ignores `.immerse, .potato`. KEEP THAT.
- Add `scroll-snap-type: x mandatory` and `.slice { scroll-snap-align: start; scroll-snap-stop: always; }` so one plate lands.
- Finger swipe left/right = next/back plate. That is the whole film.
- Vertical swipe on the potato does NOTHING to the story. Rise/delve stay the two explicit axis marks (already in `.axis-marks`).
- Pinch or ctrl/meta+wheel = zoom the current `.face` only (already sketched). Clamp 1–2.4. Reset zoom on land().
- Tap the plate: if it has motion AND a gold dot, Play 6s no-loop, return to still. If no motion, tap does not skip.
- Tap `.hfilm` thumb or `.beads` = land(n).
- Back mark = receipt rollback (already). Keep it fat enough for a thumb (min 44×44).
- Ways mark toggles `.way-pics`. Ways must be able to SWITCH REELS without leaving `/`.
- Glow on the dawn reel still goes to `/goal`.
- Never auto-advance on a timer. If `player.tsx` has a 6s advance toggle, default it OFF and do not use it in Immerse.
- Reduced motion: skip snap-smooth, skip motion play.

Easy chrome
- One row of marks: back · ways · glow. Words stay tiny. Icons already exist in `PeaceIcon`.
- Beads stay on the left, axis marks on the right. Enlarge hit slop with padding, keep the dots small.
- `.hfilm` is optional once snap works. Do not let two horizontal scrollers fight: if both are visible, potato is the story and hfilm is a picker that does not capture the page swipe.
- Mobile (≤720px): hide hfilm-line story text or keep one sentence. Do not stack more chrome.

Reel switch
- `PRESENT` stays the dawn/obsidian reel. Do not replace it.
- Add `FRIEND_FILM` in `src/lib/present.ts` (or `src/lib/friend-film.ts`).
- `Immerse` takes the reel from state. Ways button `farther-well` (already in way-pics) switches to the friend reel.
- Story line for friend reel: "The fawn looked back. That is how a we began."
- Dawn story line stays `BPEACE.story`.

FRIEND_FILM slices (use files that already exist; do not invent paths)

```
id        src                    high                 low                  color     word     mark
found     /farther-well.jpg      /pink-forest.jpg     /leaf-deer.jpg       #e7c4b0   begin    door
notice    /pink-forest.jpg       /farther-well.jpg    /leaf-deer.jpg       #e7c27a   notice   feather
well      /leaf-deer.jpg         /farther-well.jpg    /sisters-well.jpg    #9ecfb8   rest     circle
meet      /scroll-meet.jpg       /mark-orange.jpg     /weather.jpg         #e39b5a   like     door
rain      /weather.jpg           /red-horizon.jpg     /farther-well.jpg    #e25b4a   weather  heart
offer     /mark-orange.jpg       /leaf-deer.jpg       /scroll-meet.jpg     #e39b5a   offer    spark
weee      /peachfall-walk.jpg    /pink-forest.jpg     /weather.jpg         #f3b183   weee     spark
rest      /sisters-well.jpg      /leaf-deer.jpg       /pink-forest.jpg     #9ecfb8   beside   feather
fork      /pink-forest.jpg       /scroll-doors.jpg    /peachfall-walk.jpg  #c9b7e6   path     moon
further   /peachfall-walk.jpg    /glow.jpg            /gen22.jpg           #f3d7a1   further  sun
```

Motion (tap-only gold dot): found → farther-well.mp4, rain → rain.mp4.
gen2.mp4 / gen4.mp4 / gen22.mp4 stay on their own plates. gen22.jpg may appear only as the `further.low` delve layer so the child walk does not change faces mid-film.

Receipts: keep `sae-receipt` per reel (`sae-receipt` and `sae-receipt-fawn`) so rollback does not mix dawn and friend.

### 2. Wall 2D + open look (next, 14h) — only after potato snap feels good
Closed wall pans both ways. Glue skips `.wall`.
Open look: scroll/pinch = zoom. Swipe L/R at zoom 1 = next/back. Hand mode pans. Gold dot = play.
Do not start this until step 1 is on a preview you can hold.

### 3. Then, only if 1 and 2 are right
- Friend path plates + whole carrot item in tale (10h)
- Goal + knight share save (12h)
- Form CSS daylight fallback, one Docker (8h)
- SW media cache bump for new stills (8h)
- Hidden keep live unlinked (4h)
- Playtest: no autoplay, mobile swipe, receipts, rollback (6h)

## Files you will likely touch in step 1
- `src/lib/present.ts` — export FRIEND_FILM
- `src/lib/bpeace.ts` — friend story + marks if needed
- `src/components/immerse.tsx` — reel state, snap land, gold-dot play, ways switches reel
- `src/styles.css` — potato snap, 44px mark slop, hide fighting chrome ≤720px
- `public/__keep/` — drop PLAN.md SEMIOTIC.md FRIENDS.md POTATO.md STORYBOARD-GEN22.md HOURS.md
- `public/sw.js` — only if new media

Do not touch
- wink / camera / occult capture defaults
- gen2.jpg gen4.jpg gen22.jpg file bytes
- main
- a new route for the friend film (it lives inside Immerse)

## Acceptance for step 1
- Phone: swipe the potato, one plate per swipe, it stays.
- Rise/delve only from the two side marks.
- Play never starts by itself.
- Ways can show the fawn reel and the dawn reel.
- Back walks the receipt.
- Dawn film still exists unchanged.
- No new app, no new face, no protocol handler claim.
- Preview on bpeace. Report that preview URL. Do not say "all live."

## Short story the film should tell (few words on screen)
Dawn reel: A kinder way. The red sister is lively. The porch is a pillow fight.
Friend reel: The fawn looked back. That is how a we began.

Friendship law (do not print all of it; it lives in __keep)
Notice. Stop. Look where the guide looks. Offer the whole thing.
Do not eat the gift to prove you have it. Share the weather.
Rest beside. Choose the next path together. Keep going.

Weee.
