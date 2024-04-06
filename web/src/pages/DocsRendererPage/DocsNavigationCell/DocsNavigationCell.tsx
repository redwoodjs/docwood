import Wrap from 'src/components/Wrap/Wrap'
import { getChildrenUpToDepth, getDocumentTree } from 'src/lib/docs'

export const data = async ({ depth }: { depth: number }) => {
  const tree = await getDocumentTree()
  return { links: getChildrenUpToDepth(tree, depth) }
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

export const Success = ({ links }: Awaited<ReturnType<typeof data>>) => {
  const linksWithoutIndex = links.filter((link) => !link.index)
  return (
    <Wrap title="DocsNavigationCell" level={3}>
      <nav>
        <ul className="flex flex-col space-y-2">
          <li>
            <a href="/docs" className="text-sm font-semibold">
              Home
            </a>
          </li>
          {linksWithoutIndex.map((link) => {
            const childrenWithoutIndex = link.children.filter(
              (child) => !child.index
            )
            return (
              <li key={link.link}>
                <a href={link.link} className="text-sm font-semibold">
                  {link.title}
                </a>
                {childrenWithoutIndex.length > 0 && (
                  <ul
                    key={`${link.link}-sub`}
                    className="flex flex-col space-y-1 border-l border-gray-300 pl-2 text-sm"
                  >
                    {childrenWithoutIndex.map((child) => (
                      <li key={child.link}>
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
