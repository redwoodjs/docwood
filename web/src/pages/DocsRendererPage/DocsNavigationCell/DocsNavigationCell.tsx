import Wrap from 'src/components/Wrap/Wrap'
import { getDocumentTreeToDepth } from 'src/lib/docs'
import { DocumentTreeNode } from 'src/lib/types'

const getActiveLink = (
  nodes: DocumentTreeNode[],
  docPath: string,
  currentValue: string
): string | null => {
  let bestMatch = currentValue
  for (const node of nodes) {
    if (node.link === docPath) {
      return node.link
    }
    if (node.type === 'directory') {
      const activeLink = getActiveLink(node.children, docPath, currentValue)
      if (activeLink && activeLink.length > bestMatch.length) {
        bestMatch = activeLink
      }
    }
  }
  return bestMatch
}

export const data = async ({
  docPath,
  depth,
}: {
  docPath: string
  depth: number
}) => {
  const subTree = await getDocumentTreeToDepth(depth)
  const activeLink =
    docPath === undefined
      ? '/docs'
      : getActiveLink(subTree, '/docs/' + docPath, '')

  return { links: subTree, activeLink }
}

export const Loading = () => {
  return <div>Loading nav...</div>
}

export const Failure = ({ error }) => {
  return (
    <>
      <div>Could not load navigation:</div>
      <p className="text-red-600">{JSON.stringify(error.message)}</p>
    </>
  )
}

export const Success = ({
  links,
  activeLink,
}: Awaited<ReturnType<typeof data>>) => {
  const linksWithoutIndex = links.filter((link) => link.link !== '/docs')

  return (
    <Wrap title="DocsNavigationCell" level={3}>
      <nav>
        <ul className="flex flex-col space-y-2">
          <li>
            <a
              href="/docs"
              className={`text-sm font-semibold ${activeLink === '/docs' ? 'active-link' : ''}`}
            >
              Home
            </a>
          </li>
          {linksWithoutIndex.map((link) => {
            const childrenWithoutIndex =
              link.type === 'directory'
                ? link.children.filter((child) => child.link !== link.link)
                : []

            return (
              <li key={link.link}>
                <a
                  href={link.link}
                  className={`text-sm font-semibold ${activeLink === link.link ? 'active-link' : ''}`}
                >
                  {link.title}
                </a>
                {childrenWithoutIndex.length > 0 && (
                  <ul
                    key={`${link.link}-sub`}
                    className="flex flex-col space-y-1 border-l border-gray-300 pl-2 text-sm"
                  >
                    {childrenWithoutIndex.map((child) => (
                      <li
                        key={child.link}
                        className={
                          activeLink === child.link ? 'active-link' : ''
                        }
                      >
                        <a href={child.link}>{child.title}</a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </nav>
    </Wrap>
  )
}
