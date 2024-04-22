ARG BASE_IMAGE=node:20.12.2-alpine
FROM ${BASE_IMAGE} as base

RUN mkdir /app
WORKDIR /app

# Required for building the api and web distributions
ENV NODE_ENV development

FROM base as dependencies

# Enable corepack
RUN corepack enable yarn && yarn -v

COPY .yarn .yarn
COPY .yarnrc.yml .yarnrc.yml
COPY package.json package.json
COPY web/package.json web/package.json
COPY yarn.lock yarn.lock

RUN --mount=type=cache,target=/root/.yarn/berry/cache \
    --mount=type=cache,target=/root/.cache yarn install

COPY redwood.toml .
COPY graphql.config.js .

FROM dependencies as web_build

ENV NODE_ENV production

COPY web web
COPY docs docs
RUN yarn rw build web -v

FROM dependencies

ENV NODE_ENV production

COPY --from=web_build /app/web /app/web
COPY --from=web_build /app/docs /app/docs

COPY .fly .fly

ENTRYPOINT ["sh"]
CMD [".fly/start.sh"]
