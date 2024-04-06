import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

import fm from 'front-matter'
import Markdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'

import Wrap from 'src/components/Wrap/Wrap'
import { getNodeByLink } from 'src/lib/docs'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export const data = async ({ docPath }) => {
  let documentNode = await getNodeByLink(
    docPath ? `/docs/${docPath}` : '/docs/'
  )

  if (!documentNode) {
    throw new Error('Document not found')
  }

  let type = documentNode.type
  if (type === 'directory') {
    documentNode = documentNode.children.find((child) => child.index)
    if (!documentNode) {
      throw new Error('Index not found for directory')
    }
    type = documentNode.type
  }

  // Handle simple .md files
  if (type === 'md') {
    const content = await fs.readFile(documentNode.path, 'utf8')
    const { attributes, body } = fm(content)

    return (
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
    )
  }

  // Handle .mdx files
  if (type === 'mdx') {
    const { default: Component } = await import(
      /* @vite-ignore */ documentNode.path
    )

    return (
      <Wrap title="MdxComponent" level={4}>
        <div className="custom-index my-4">
          <Component />
        </div>
      </Wrap>
    )
  }

  console.dir({ documentNode }, { depth: null })

  throw new Error('Document type not supported')
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

export const Success = (Component: Awaited<ReturnType<typeof data>>) => {
  return Component
}
