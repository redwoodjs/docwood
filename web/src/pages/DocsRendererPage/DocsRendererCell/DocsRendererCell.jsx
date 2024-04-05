import fs from 'node:fs'
import path from 'node:path'

import { evaluate } from '@mdx-js/mdx'
import fg from 'fast-glob'
import fm from 'front-matter'
import * as jsxRuntime from 'react/jsx-runtime'
import Markdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'

import Wrap from 'src/components/Wrap'
import { DOCS_ROOT_PATH } from 'src/lib/paths'

import CustomIndexComponent from './CustomIndexComponent'
import MdxRenderer from './MdxRenderer'

export const data = async ({ docPath }) => {
  let parsedMarkdown, mdx, IndexComponent

  // first try looking for an md file with the exact name of the URL path
  // if docPath is undefined, assume the root `index` of the whole /docs dir
  // and just look for `index.md`
  let filePath = path.join(DOCS_ROOT_PATH, `${docPath || 'index'}.md*`)

  if (!fg.sync(filePath).length) {
    // if not found, look for an index.md file in the directory of docPath
    filePath = path.join(DOCS_ROOT_PATH, docPath, `index.md*`)
  }

  // see if fast-glob finds any files that match the path
  const matchingFilePath = fg.sync(filePath)[0]

  if (!matchingFilePath) {
    // no file and no index, so create one
    IndexComponent = CustomIndexComponent(docPath)
  } else if (matchingFilePath.match(/\.mdx$/)) {
    // mdx file
    parsedMarkdown = fm(fs.readFileSync(matchingFilePath, 'utf8'))
    mdx = parsedMarkdown.body
  } else {
    // plain md file
    parsedMarkdown = fm(fs.readFileSync(matchingFilePath, 'utf8'))
  }

  return { ...parsedMarkdown, mdx, IndexComponent }
}

export const Loading = () => {
  return <div>Docs loading...</div>
}

export const Failure = ({ error }) => {
  return (
    <>
      <div>Doc page not found!</div>
      <p className="text-red-600">{JSON.stringify(error.message)}</p>
    </>
  )
}

export const Success = ({ attributes, body, mdx, IndexComponent }) => {
  return (
    <Wrap title="DocsRendererCell" level={3}>
      {IndexComponent && (
        <Wrap title="CustomIndexComponent" level={4}>
          <div className="custom-index my-4">
            <IndexComponent />
          </div>
        </Wrap>
      )}

      {mdx ? (
        <Wrap title="MdxComponent" level={4}>
          <div className="custom-index my-4">
            <MdxRenderer mdx={mdx} />
          </div>
        </Wrap>
      ) : (
        <>
          <Wrap title="Markdown" level={4}>
            <Markdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              className="markdown my-4"
            >
              {body}
            </Markdown>
            <p className="my-6 border-t border-gray-300 pt-4 text-sm text-gray-400">
              Markdown Front Matter:{' '}
              <div className="rounded bg-gray-200 px-2 py-1 font-mono text-xs text-gray-600">
                {JSON.stringify(attributes)}
              </div>
            </p>
          </Wrap>
        </>
      )}
    </Wrap>
  )
}
