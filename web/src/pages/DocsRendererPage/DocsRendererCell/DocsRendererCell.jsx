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

export const data = async ({ docPath }) => {
  // if docPath is undefined, assume the root `index` of the whole /docs dir
  // first try looking for an md file with the exact name of the URL path
  let filePath = path.join(DOCS_ROOT_PATH, `${docPath || 'index'}.md*`)

  // if not found, look for an index.md file in the directory of docPath
  if (!fg.sync(filePath).length) {
    filePath = path.join(DOCS_ROOT_PATH, docPath, `index.md*`)
  }

  // look for the file that matches the glob
  const matchingFilePath = fg.sync(filePath)[0]

  console.info('\n\n***************************\n\n')
  console.info('docPath: ', docPath)
  console.info('filePath: ', filePath)
  console.info('matchingFilePath: ', matchingFilePath)
  console.info('\n\n***************************\n\n')

  let md, MdxComponent, IndexComponent

  if (!matchingFilePath) {
    console.info('Custom index')
    // no file and no index, so create one
    IndexComponent = CustomIndexComponent(docPath)
  } else if (matchingFilePath.match(/\.mdx$/)) {
    console.info('MDX file')
    // mdx file
    MdxComponent = (
      await evaluate(fs.readFileSync(matchingFilePath, 'utf8'), {
        ...jsxRuntime,
        baseUrl: import.meta.url,
        remarkPlugins: [remarkGfm, remarkBreaks],
      })
    ).default
  } else {
    console.info('Plain md file')
    // plain md file
    md = fs.readFileSync(matchingFilePath, 'utf8')
  }

  console.info(MdxComponent)

  return { ...fm(md), MdxComponent, IndexComponent }
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

export const Success = ({ attributes, body, MdxComponent, IndexComponent }) => {
  return (
    <Wrap title="DocsRendererCell" level={3}>
      {IndexComponent && (
        <Wrap title="CustomIndexComponent" level={4}>
          <div className="custom-index my-4">
            <IndexComponent />
          </div>
        </Wrap>
      )}

      {MdxComponent && (
        <Wrap title="MdxComponent" level={4}>
          <div className="custom-index my-4">
            <MdxComponent />
          </div>
        </Wrap>
      )}

      {body && (
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
