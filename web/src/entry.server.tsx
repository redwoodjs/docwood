import fs from 'node:fs'

import type { TagDescriptor } from '@redwoodjs/web/htmlTags'
import { MiddlewareResponse } from '@redwoodjs/web/middleware'

import Routes from './Routes'
import App from './App'
import { Document } from './Document'


interface Props {
  css: string[]
  meta?: TagDescriptor[]
}

export const ServerEntry: React.FC<Props> = ({ css, meta }) => {
  return (
    <Document css={css} meta={meta}>
      <App>
        <Routes />
      </App>
    </Document>
  )
}

export const registerMiddleware = async () => {
  const matchPrefix = 'http://localhost:8910/@fs'
  const matchIncludes = 'web/src/docs/'

  const { getPaths } = await import('@redwoodjs/project-config')
  const webSrc = getPaths().web.src

  const clientBuildManifest = JSON.parse(
    fs.readFileSync(
      getPaths().web.distBrowser + '/client-build-manifest.json',
      'utf-8'
    )
  )

  // NOTE: This is probably unsafe and could be used to read files outside of the intended directory?
  return [
    (req, _res) => {
      if (req.url.startsWith(matchPrefix) && req.url.includes(matchIncludes)) {
        console.log('NOTE: custom middleware is responding to:', req.url)

        const srcFilePath = req.url
          .substring(matchPrefix.length)
          .substring(webSrc.length + 1)

        const entry = clientBuildManifest[srcFilePath]
        if (!entry) {
          throw new Error(
            `No entry for ${srcFilePath} in client build manifest`
          )
        }

        const entryFile = fs.readFileSync(
          getPaths().web.distBrowser + '/' + entry.file,
          'utf8'
        )

        const newRes = new MiddlewareResponse(entryFile)
        newRes.headers.set('Content-Type', 'application/javascript')
        newRes.headers.set(
          'Cache-Control',
          'no-cache, no-store, must-revalidate'
        )
        return newRes
      }

      if (req.url.startsWith(matchPrefix)) {
        console.log('NOTE: custom middleware is responding to:', req.url)

        const srcFilePath = req.url.substring(matchPrefix.length)
        const distFilePath = srcFilePath.replace(
          'web/src/',
          'web/dist/client/assets/'
        )

        const entryFile = fs.readFileSync(distFilePath, 'utf8')

        const newRes = new MiddlewareResponse(entryFile)
        newRes.headers.set('Content-Type', 'application/javascript')
        newRes.headers.set(
          'Cache-Control',
          'no-cache, no-store, must-revalidate'
        )
        return newRes
      }
    },
  ]
}
