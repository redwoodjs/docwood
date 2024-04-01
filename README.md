# Docwood

Test for building a RedwoodJS-powered, React Server Components app for serving documentation.

## Development

The dev server isn't working with RSC, so you will need to build and serve between each code change.

In addition, there are a couple of hacks needed to work with RSC (see below). You can build, enable hacks and serve with one command:

```
yarn bs
```

### Hacks

Run `yarn bs` to build and serve and automatically perform these hacks:

1. web/dist/server/route-manifest.json creates regex route matches in the fastify style, but they need to be in the Express style for RSC. `yarn sed` replaces the docs matcher with the proper version.
2. The docs markdown files in web/src/docs are not copied to dist at build time. `yarn copy` fixes that and moves them over.
