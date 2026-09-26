# Linux image for play. A phone opens it on the LAN, or runs this same
# image under Termux. The NFC pass (a gif or a video, chosen by context)
# is the next step; this image only has to be servable.
FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV NITRO_PRESET=node-server
RUN npm run build

FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4180
COPY --from=build /app/.output ./.output
EXPOSE 4180
CMD ["node", ".output/server/index.mjs"]
