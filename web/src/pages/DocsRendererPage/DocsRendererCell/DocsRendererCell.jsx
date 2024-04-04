import fs from 'node:fs'
import path from 'node:path'

import { evaluate } from '@mdx-js/mdx'
import fm from 'front-matter'
import * as jsxRuntime from 'react/jsx-runtime'
import Markdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'

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
  console.info('attributes', attributes)
  console.info('MdxComponent', MdxComponent)
  console.info('IndexComponent', IndexComponent)

  return (
    <div className="mt-8 border-2 border-dashed border-gray-400 p-4">
      <h2 className="-ml-4 -mt-10 font-semibold text-gray-400">
        DocsRendererCell
      </h2>

      {IndexComponent && (
        <div className="mt-8 border-2 border-dashed border-gray-300 p-4">
          <h3 className="-ml-4 -mt-10 font-semibold text-gray-300">
            CustomIndexComponent
          </h3>

          <div className="custom-index my-4">
            <IndexComponent />
          </div>
        </div>
      )}

      {MdxComponent && (
        <div className="mt-8 border-2 border-dashed border-gray-300 p-4">
          <h3 className="-ml-4 -mt-10 font-semibold text-gray-300">
            MdxComponent
          </h3>

          <div className="custom-index my-4">
            <MdxComponent />
          </div>
        </div>
      )}

      {body && (
        <>
          <div className="mt-8 border-2 border-dashed border-gray-300 p-4">
            <h3 className="-ml-4 -mt-10 font-semibold text-gray-300">
              Markdown
            </h3>
            <Markdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              className="markdown my-4"
            >
              {body}
            </Markdown>
          </div>

          <p className="my-4 text-sm">
            Markdown Front Matter:{' '}
            <span className="font-mono text-sm text-gray-600">
              {JSON.stringify(attributes)}
            </span>
          </p>
        </>
      )}
    </div>
  )
}
