# Build the Vite app, then serve the static output with nginx.
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
# Baked into the bundle + version.json for update detection. Set at deploy time
# (e.g. the deployed git sha); falls back to a build timestamp.
ARG SOURCE_COMMIT
ENV SOURCE_COMMIT=$SOURCE_COMMIT
RUN npm run build

FROM nginx:alpine
# Pull Alpine security fixes that the base image has not picked up yet (zlib/openssl/musl/curl).
RUN apk upgrade --no-cache
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
