import Wrap from 'src/components/Wrap/Wrap'
import { getDocumentMap } from 'src/lib/docs'
import { DocumentTreeNode } from 'src/lib/types'

// import ClientMdxRenderer from './subs/ClientMdxRenderer'
import StaticMarkdownRenderer from './subs/StaticMarkdownRenderer'
import VirtualIndexRenderer from './subs/VirtualIndexRenderer'

const selectRenderer = async (
  node: DocumentTreeNode
): Promise<JSX.Element | undefined> => {
  if (node.type === 'directory') {
    // Try to find the index entry
    const index = node.children.find((child) => child.link === node.link)
    if (index) {
      return selectRenderer(index)
    }

    // We will generate an index based on the directory
    return <VirtualIndexRenderer node={node} />
  }

  if (node.type === 'md') {
    return <StaticMarkdownRenderer node={node} />
  }

  if (node.type === 'mdx') {
    // TODO(jgmw): I don't see why this shouldn't work but maybe the whole dev server in production
    //  thing might be messing with it?

    // For now load the content and then pass it to a MDX renderer on the client
    // const content = await fs.readFile(node.path, 'utf-8')
    // const { body: mdx } = fm(content)
    // return <ClientMdxRenderer mdx={mdx} />
    return <StaticMarkdownRenderer node={node} />
  }

  return undefined
}

export const data = async ({ docPath }) => {
  const documentMap = await getDocumentMap()
  const mapKey = docPath ? `/docs/${docPath}` : '/docs'
  const node = documentMap.get(mapKey)

  if (!node) {
    console.log('Document not found', mapKey)
    throw new Error('Document not found')
  }

  const renderer = await selectRenderer(node)
  if (!renderer) {
    throw new Error('No renderer found')
  }

  return renderer
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

export const Success = (Component: Awaited<ReturnType<typeof data>>) => {
  return (
    <Wrap title="DocsRendererCell" level={3}>
      {Component}
    </Wrap>
  )
}
