import fs from 'node:fs'
import path from 'node:path'

import fm from 'front-matter'
import Markdown from 'react-markdown'

export const data = ({ docPath }) => {
  // if docPath is undefined, assume `index`
  let filePath = path.join('dist', 'rsc', 'docs', `${docPath || 'index'}.md`)

  const fileExists = fs.existsSync(filePath)

  // path doesn't exist, check if maybe `index` does instead
  if (!fileExists) {
    filePath = path.join('dist', 'rsc', 'docs', docPath, 'index.md')
  }

  const file = fs.readFileSync(filePath, 'utf8')

  return { ...fm(file) }
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

export const Success = ({ attributes, body }) => {
  return (
    <div className="mt-8 border-2 border-dashed border-gray-400 p-4">
      <h2 className="-ml-4 -mt-10 text-gray-400 font-semibold">
        DocsRendererCell
      </h2>

      <div className="mt-8 border-2 border-dashed border-gray-300 p-4">
        <h3 className="-ml-4 -mt-10 text-gray-300 font-semibold">Markdown</h3>
        <Markdown className="markdown my-4">{body}</Markdown>
      </div>

      <p className="my-4 text-sm">
        Markdown Front Matter:{' '}
        <span className="font-mono text-sm text-gray-600">
          {JSON.stringify(attributes)}
        </span>
      </p>
    </div>
  )
}
