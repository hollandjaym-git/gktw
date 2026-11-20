FROM node:22-alpine
# Pull Alpine security fixes that the base image has not picked up yet (zlib/openssl/musl/curl).
RUN apk upgrade --no-cache

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY *.js ./

ENV PORT=3001
EXPOSE 3001

CMD ["npm", "start"]
