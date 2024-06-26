import Wrap from 'src/components/Wrap'

import DocsNavigationCell from './DocsNavigationCell'
import DocsRendererCell from './DocsRendererCell/DocsRendererCell'
import DocsTableOfContentsCell from './DocsTableOfContentsCell'

const DocsRendererPage = ({ path }) => {
  return (
    <Wrap title="DocsRendererPage" level={2}>
      <div className="flex items-start space-x-4">
        <aside className="w-1/5 flex-shrink-0">
          <DocsNavigationCell docPath={path} depth={2} />
        </aside>
        <main className="w-3/5">
          <DocsRendererCell docPath={path} />
        </main>
        <aside className="sticky top-0 w-1/5">
          <DocsTableOfContentsCell docPath={path} depth={3} />
        </aside>
      </div>
    </Wrap>
  )
}

export default DocsRendererPage
