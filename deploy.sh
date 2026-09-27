#!/bin/sh
# Easy pre-alpha play. Pulls the baked image. Does not start Grok Build.
set -eu
docker pull ghcr.io/stevoblevo/sae-anewgam:latest
exec docker run --rm --name sae-anewgam -p 4180:4180 ghcr.io/stevoblevo/sae-anewgam:latest
