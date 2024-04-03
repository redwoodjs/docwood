import fs from 'node:fs'
import path from 'node:path'

import fm from 'front-matter'
import Markdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'

import { DOCS_ROOT_PATH } from 'src/lib/paths'

import CustomIndexComponent from './CustomIndexComponent'

export const data = ({ docPath }) => {
  // if docPath is undefined, assume `index`
  let filePath = path.join(DOCS_ROOT_PATH, `${docPath || 'index'}.md`)

  // path doesn't exist, check if maybe `index` does instead
  if (!fs.existsSync(filePath)) {
    filePath = path.join(DOCS_ROOT_PATH, docPath, 'index.md')
  }

  let markdown, IndexComponent

  // if an index.md page still doesn't exist, create an index page on the fly with
  // links to the sub pages
  if (!fs.existsSync(filePath)) {
    IndexComponent = CustomIndexComponent(docPath)
  } else {
    markdown = fs.readFileSync(filePath, 'utf8')
  }

  return { ...fm(markdown), IndexComponent }
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

export const Success = ({ attributes, body, IndexComponent }) => {
  return (
    <div className="mt-8 border-2 border-dashed border-gray-400 p-4">
      <h2 className="-ml-4 -mt-10 text-gray-400 font-semibold">
        DocsRendererCell
      </h2>

      {IndexComponent ? (
        <div className="mt-8 border-2 border-dashed border-gray-300 p-4">
          <h3 className="-ml-4 -mt-10 text-gray-300 font-semibold">
            CustomIndexComponent
          </h3>

          <div className="custom-index my-4">
            <IndexComponent />
          </div>
        </div>
      ) : (
        <>
          <div className="mt-8 border-2 border-dashed border-gray-300 p-4">
            <h3 className="-ml-4 -mt-10 text-gray-300 font-semibold">
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
