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
    <>
      <Markdown>{body}</Markdown>
      <div>{JSON.stringify(attributes)}</div>
    </>
  )
}
