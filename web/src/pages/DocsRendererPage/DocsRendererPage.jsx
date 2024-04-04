import DocsNavigationCell from './DocsNavigationCell'
import DocsRendererCell from './DocsRendererCell/DocsRendererCell'

const DocsRendererPage = ({ path }) => {
  return (
    <div className="mx-auto mt-8 max-w-screen-lg border-2 border-dashed border-gray-500 p-4">
      <h1 className="-ml-4 -mt-10 font-semibold text-gray-500">
        DocsRendererPage
      </h1>

      <div className="flex items-start space-x-4">
        <aside className="w-1/4 w-full flex-shrink-0">
          <DocsNavigationCell />
        </aside>
        <main className="flex-grow">
          <DocsRendererCell docPath={path} />
        </main>
      </div>
    </div>
  )
}

export default DocsRendererPage
