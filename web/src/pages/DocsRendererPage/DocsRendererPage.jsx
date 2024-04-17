import Wrap from 'src/components/Wrap'

import DocsNavigationCell from './DocsNavigationCell'
import DocsRendererCell from './DocsRendererCell/DocsRendererCell'
import DocsTableOfContentsCell from './DocsTableOfContentsCell'

const DocsRendererPage = ({ path }) => {
  return (
    <Wrap title="DocsRendererPage" level={2}>
      <div className="flex items-start space-x-4">
        <aside className="w-1/4 flex-shrink-0">
          <DocsNavigationCell depth={2} />
        </aside>
        <main className="flex-grow">
          <DocsRendererCell docPath={path} />
        </main>
        <aside className="flex-shrink-0">
          <DocsTableOfContentsCell docPath={path} depth={3} />
        </aside>
      </div>
    </Wrap>
  )
}

export default DocsRendererPage
