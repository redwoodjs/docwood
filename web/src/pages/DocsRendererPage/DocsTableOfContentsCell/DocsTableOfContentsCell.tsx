import Wrap from 'src/components/Wrap/Wrap'
import { getDocumentMap, getTableOfContentsToDepth } from 'src/lib/docs'

import { TOCItem } from './subs/TOCItem'

export const data = async ({
  docPath,
  depth,
}: {
  docPath: string
  depth: number
}) => {
  const documentMap = await getDocumentMap()
  const mapKey = docPath ? `/docs/${docPath}` : '/docs'
  const node = documentMap.get(mapKey)

  if (!node) {
    console.log('Document not found', mapKey)
    throw new Error('Document not found')
  }

  const toc = await getTableOfContentsToDepth(node, depth)
  return { toc }
}

export const Loading = () => {
  return <div>Loading table of contents...</div>
}

export const Failure = ({ error }) => {
  return (
    <>
      <div>Could not load table of contents:</div>
      <p className="text-red-600">{JSON.stringify(error.message)}</p>
    </>
  )
}

export const Success = ({ toc }: Awaited<ReturnType<typeof data>>) => {
  if (toc.length === 0) {
    return null
  }

  return (
    <Wrap title="DocsTableOfContentsCell" level={3}>
      <div className="flex flex-col">
        {toc.map((node) => (
          <TOCItem key={node.value + node.depth} node={node} />
        ))}
      </div>
    </Wrap>
  )
}
