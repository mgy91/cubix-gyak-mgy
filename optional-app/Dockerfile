# =========================================================================
# 1. STAGE: Builder (Fordítási / Építési fázis)
# =========================================================================
FROM node:20-alpine AS builder
WORKDIR /build

# Kötelező építési időbeli paraméter (ARG)
ARG VERSION=1.0.0

COPY package*.json ./
RUN npm install
COPY server.js .

# Szimuláljuk a fordítási lépést és rögzítjük az építési verziót
RUN echo "Build folyamat lefutott. Verzió: $VERSION" > build-info.txt

# =========================================================================
# 2. STAGE: Runner (Gyártási / Futtatási fázis)
# =========================================================================
FROM node:20-alpine
WORKDIR /app

# Újra deklaráljuk az ARG-ot a második stage-ben, és átadjuk futásidejű ENV-nek
ARG VERSION=1.0.0
ENV APP_VERSION=$VERSION
ENV NODE_ENV=production
ENV PORT=4000

# Csak a szükséges fájlokat másoljuk át az első fázisból
COPY --from=builder /build/server.js .
COPY --from=builder /build/package*.json .
COPY --from=builder /build/build-info.txt .

# Kizárólag a produkciós függőségek telepítése
RUN npm install --only=production

# Alacsony jogkörű, biztonságos felhasználó beállítása (Non-root)
RUN chown -R node:node /app
USER node

EXPOSE 4000
CMD ["node", "server.js"]
