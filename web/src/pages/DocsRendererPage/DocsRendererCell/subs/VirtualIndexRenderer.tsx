import fs from 'node:fs/promises'

import { FolderIcon, DocumentIcon } from '@heroicons/react/24/outline'
import fm from 'front-matter'

import Wrap from 'src/components/Wrap/Wrap'
import { DocumentTreeBranch } from 'src/lib/types'

const VirtualIndexRenderer = async ({ node }: { node: DocumentTreeBranch }) => {
  const children = node.children

  const titles = new Map<string, string>()
  const descriptions = new Map<string, string>()
  for (const child of children) {
    const content = await fs.readFile(child.path, 'utf-8')
    const { attributes } = fm(content)
    // @ts-expect-error - Attributes is of type unknown so accessing title is not TS safe
    titles.set(child.link, attributes.title ?? child.title)
    // @ts-expect-error - Attributes is of type unknown so accessing description is not TS safe
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
