FROM node:20-alpine AS builder
WORKDIR /build
COPY package*.json ./
RUN npm install
COPY server.js .

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /build/server.js .
COPY --from=builder /build/package*.json .
RUN npm install --only=production
RUN chown -R node:node /app
USER node
EXPOSE 3000
CMD ["node", "server.js"]
