# Docwood

Test for building a RedwoodJS-powered, React Server Components app for serving documentation.

## Development

This repo contains no actual docs, those come from the main [redwoodjs/redwood](https://github.com/redwoodjs/redwood) repo, in the docs/docs directory.

To pull down docs from the redwoodjs/redwood repo, run the sync command:

```
yarn sync
```

The dev server isn't working with RSC yet, so to work on the site itself you need to build and serve between each code change (brutal, we know):

```
yarn rw build && yarn rw serve
```

Or use the shorthand version:

```
yarn bs
```

To do first sync the docs and then build and serve, we have an even shorter shorthand:

```
yarn sbs
```

## File Structure

The URLs to a single doc page will map to the same directory structure in `docs/content`:

```
https://redwoodjs.com/docs/deployment/baremetal

content
   ├── deployment
   │   ├── baremetal.md    <-- serves this file
   │   ├── index.md
   │   └── serverless
   │       ├── cloudHosting
   │       │   └── awsLambda.md
   │       ├── netlify.md
   │       └── render.md
   └── index.md
```

`index.md` will be served for the top level directory. For example, browsing to `https://redwoodjs.com/docs/deployment` will serve the file `docs/deployment/index.md`.

If an `index.md` file does not exist when browsing to a directory, a barebones one will be built on the fly and served instead. Given the above directory structure, here's the page shown when browsing to `https://redwoodjs.com/docs/deployment/serverless`:

![image](https://github.com/cannikin/docwood/assets/300/c31ff886-884c-470c-ac40-5872e022c31e)
