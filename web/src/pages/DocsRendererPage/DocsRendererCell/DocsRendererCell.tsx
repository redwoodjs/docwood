// import fs from 'node:fs/promises'

// import fm from 'front-matter'

import Wrap from 'src/components/Wrap/Wrap'
import { getDocumentMap } from 'src/lib/docs'
import { DocumentTreeNode } from 'src/lib/types'

// import ClientMdxRenderer from './subs/ClientMdxRenderer'
import StaticMarkdownRenderer from './subs/StaticMarkdownRenderer'
import VirtualIndexRenderer from './subs/VirtualIndexRenderer'

export const data = async ({ docPath }) => {
  const documentMap = await getDocumentMap()
  const mapKey = docPath ? `/docs/${docPath}` : '/docs'
  const node = documentMap.get(mapKey)

  if (!node) {
    console.log('Document not found', mapKey)
    throw new Error('Document not found')
  }

  const getRenderer = async (node: DocumentTreeNode) => {
    if (node.type === 'directory') {
      // Try to find the index entry
      const index = node.children.find((child) => child.link === node.link)
      if (index) {
        return await getRenderer(index)
      }

      // We will generate an index based on the directory
      return { Component: <VirtualIndexRenderer node={node} /> }
    }

    if (node.type === 'md') {
      return { Component: <StaticMarkdownRenderer node={node} /> }
    }

    if (node.type === 'mdx') {
      // TODO(jgmw): I don't see why this shouldn't work but maybe the whole dev server in production
      //  thing might be messing with it?
      const { default: Renderer } = await import(node.path)
      return { Component: <Renderer /> }
    }

    return (
      <>
        <div>Unknown document type: {node.type}</div>
      </>
    )
  }

  return await getRenderer(node)
}

export const Loading = () => {
  return (
    <Wrap title="DocsRendererCell" level={3}>
      Docs loading...
    </Wrap>
  )
}

export const Failure = ({ error }) => {
  return (
    <Wrap title="DocsRendererCell" level={3}>
      <div>Doc page not found!</div>
      <p className="text-red-600">{JSON.stringify(error.message)}</p>
    </Wrap>
  )
}

export const Success = ({ Component }: Awaited<ReturnType<typeof data>>) => {
  return (
    <Wrap title="DocsRendererCell" level={3}>
      {Component}
    </Wrap>
  )
}
