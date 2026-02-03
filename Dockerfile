# ---- 1) BUILD STAGE ----
FROM node:20-alpine AS build
WORKDIR /app

# Függőségek
COPY package*.json ./
RUN npm ci

# Forráskód
COPY . .

# Angular build (prod)
RUN npm run build

# ---- 2) RUN STAGE (NGINX) ----
FROM nginx:alpine

# Angular build output bemásolása
# ⚠️ Az útvonal projektfüggő (lásd lejjebb: "dist path" rész)
COPY --from=build /app/dist/flexinform-test/browser /usr/share/nginx/html


# Angular route-ok (pl. /about) miatt SPA fallback kell
# (különben refreshre 404-et kapsz)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
