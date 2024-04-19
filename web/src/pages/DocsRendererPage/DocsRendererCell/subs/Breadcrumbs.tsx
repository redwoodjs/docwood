import { HomeIcon } from '@heroicons/react/24/outline'

import Wrap from 'src/components/Wrap/Wrap'
import { getPathToNode } from 'src/lib/docs'
import { DocumentTreeNode } from 'src/lib/types'

const Breadcrumbs = async ({ node }: { node: DocumentTreeNode }) => {
  // Don't show breadcrumbs for the root
  if (node.link === '/docs') return null

  // We remove the first crumb because it's the root and we want to start with a home icon instead
  const crumbs = await getPathToNode(node)
  crumbs.shift()

  return (
    <Wrap title="DocsBreadcrumbs" level={4}>
      <div className="mt-4 flex flex-row gap-2">
        <a href="/docs">
          <HomeIcon className="h-5 w-5 text-gray-600" />
        </a>
        {crumbs.map((crumb, i) => (
          <div key={i} className="flex flex-row gap-2">
            <div className="text-sm">&gt;</div>
            <a className="text-sm" href={crumb.link}>
              {crumb.title}
            </a>
          </div>
        ))}
      </div>
    </Wrap>
  )
}

export default Breadcrumbs
