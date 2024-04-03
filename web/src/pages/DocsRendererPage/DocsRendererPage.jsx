import DocsNavigationCell from './DocsNavigationCell'
import DocsRendererCell from './DocsRendererCell/DocsRendererCell'

const DocsRendererPage = ({ path }) => {
  return (
    <div className="mt-8 border-2 border-dashed border-gray-500 max-w-screen-lg mx-auto p-4">
      <h1 className="-ml-4 -mt-10 text-gray-500 font-semibold">
        DocsRendererPage
      </h1>

      <div className="flex items-start space-x-4">
        <aside className="w-1/4 flex-shrink-0">
          <DocsNavigationCell />
        </aside>
        <main>
          <DocsRendererCell docPath={path} />
        </main>
      </div>
    </div>
  )
}

export default DocsRendererPage
