FROM node:18-alpine AS base


FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./

RUN  npm install --production


FROM base AS builder
RUN mkdir /app && chown node:node /app
WORKDIR /app
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY . .

ENV PORT 3000

RUN npm run build


FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/src ./src
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/jsconfig.json ./jsconfig.json
COPY --from=builder --chown=node:node /app/tailwind.config.js ./tailwind.config.js

USER node

EXPOSE ${PORT}

CMD ["npm", "start"]
