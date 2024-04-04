import fs from 'node:fs'
import path from 'node:path'

import { evaluate } from '@mdx-js/mdx'
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
  let filePath = path.join(DOCS_ROOT_PATH, `${docPath || 'index'}.md`)

  // TODO .mdx lookup hack, replace with fast-glob?
  if (!fs.existsSync(filePath)) {
    filePath = filePath = path.join(DOCS_ROOT_PATH, `${docPath || 'index'}.mdx`)
  }

  // path doesn't exist, check if maybe an index exists within that directory
  if (!fs.existsSync(filePath)) {
    filePath = path.join(DOCS_ROOT_PATH, docPath, 'index.md')
  }

  // TODO Hack to check for .mdx if .md doesn't exist, maybe replace with fast-glob somehow?
  if (!fs.existsSync(filePath)) {
    filePath = path.join(DOCS_ROOT_PATH, docPath, 'index.mdx')
  }

  let md, MdxComponent, IndexComponent

  // if an index.md page still doesn't exist, create an index page on the fly with
  // links to the sub pages
  if (!fs.existsSync(filePath)) {
    IndexComponent = CustomIndexComponent(docPath)
  } else if (filePath.match(/\.mdx$/)) {
    MdxComponent = (
      await evaluate(fs.readFileSync(filePath, 'utf8'), {
        ...jsxRuntime,
        baseUrl: import.meta.url,
        remarkPlugins: [remarkGfm, remarkBreaks],
      })
    ).default
  } else {
    md = fs.readFileSync(filePath, 'utf8')
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
