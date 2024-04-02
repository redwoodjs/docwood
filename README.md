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

## File Structure

The URLs to a single doc page will map to the same directory structure in `web/src/docs`:

```
https://redwoodjs.com/docs/deployment/baremetal

docs
   ├── deployment
   │   ├── baremetal.md    <-- serves this file
   │   ├── index.md
   │   └── serverless
   │       ├── cloudHosting
   │       ├── netlify.md
   │       └── render.md
   └── index.md
```

`index.md` will be served for the top level directory. For example, browsing to `https://redwoodjs.com/docs/deployment` will serve the file `docs/deployment/index.md`.

If an `index.md` file does not exist, a barebones one will be built on the fly and served instead. Given the above directory structure, here's the page shown when browsing to `https://redwoodjs.com/docs/deployment/serverless`:

![image](https://github.com/cannikin/docwood/assets/300/c31ff886-884c-470c-ac40-5872e022c31e)
