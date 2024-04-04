import Wrap from 'src/components/Wrap'

import DocsNavigationCell from './DocsNavigationCell'
import DocsRendererCell from './DocsRendererCell/DocsRendererCell'

const DocsRendererPage = ({ path }) => {
  return (
    <Wrap title="DocsRendererPage" level={2}>
      <div className="flex items-start space-x-4">
        <aside className="w-1/4 flex-shrink-0">
          <DocsNavigationCell />
        </aside>
        <main className="flex-grow">
          <DocsRendererCell docPath={path} />
        </main>
      </div>
    </Wrap>
  )
}

export default DocsRendererPage
