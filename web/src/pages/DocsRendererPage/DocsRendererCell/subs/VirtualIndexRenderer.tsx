import fs from 'node:fs/promises'

import { FolderIcon, DocumentIcon } from '@heroicons/react/24/outline'
import fm from 'front-matter'

import Wrap from 'src/components/Wrap/Wrap'
import { DocumentTreeBranch, DocumentTreeNode } from 'src/lib/types'

const getNodeAttributes = async (node: DocumentTreeNode, depth: number) => {
  const attributes = {
    title: undefined,
    description: undefined,
  }

  // We only look one level deep otherwise it could get confusing
  if (depth > 1) {
    return attributes
  }

  if (node.type === 'directory') {
    // Look for the index file
    const index = node.children.find((child) => child.link === node.link)
    if (index) {
      return getNodeAttributes(index, depth + 1)
    }
  } else {
    const content = await fs.readFile(node.path, 'utf-8')
    const { attributes: frontmatter } = fm(content)
    // @ts-expect-error - `frontmatter` is of type unknown so accessing title is not TS safe
    attributes.title = frontmatter.title
    // @ts-expect-error - `frontmatter` is of type unknown so accessing description is not TS safe
    attributes.description = frontmatter.description
  }

  return attributes
}

const VirtualIndexRenderer = async ({ node }: { node: DocumentTreeBranch }) => {
  const children = node.children

  const titles = new Map<string, string>()
  const descriptions = new Map<string, string>()
  for (const child of children) {
    const attributes = await getNodeAttributes(child, 0)
    titles.set(child.link, attributes.title ?? child.title)
    descriptions.set(child.link, attributes.description)
  }

  return (
    <Wrap title="VirtualIndexRenderer" level={4}>
      <div className="markdown">
        <h1>{node.title}</h1>
        <dl className="my-4">
          {children.map((child) => (
            <>
              <dt key={child.link} className="flex items-center space-x-2">
                {child.type === 'directory' ? (
                  <FolderIcon className="h-5 w-5 text-gray-600" />
                ) : (
                  <DocumentIcon className="h-5 w-5 text-gray-600" />
                )}
                <a href={child.link} className="font-semibold">
                  {titles.get(child.link)}
                </a>
              </dt>
              <dd className="mb-4 ml-7">{descriptions.get(child.link)}</dd>
            </>
          ))}
        </dl>
      </div>
    </Wrap>
  )
}

export default VirtualIndexRenderer
