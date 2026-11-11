# 1. Stage: Build / Előkészítés
FROM alpine:3.19 AS builder
WORKDIR /build
COPY index.html app.js ./

# 2. Stage: Production Nginx kiszolgáló
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /build/index.html /usr/share/nginx/html/
COPY --from=builder /build/app.js /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
