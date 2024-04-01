import DocsRendererCell from './DocsRendererCell/DocsRendererCell'

const DocsRendererPage = ({ path }) => {
  console.info('DocsRendererPage', path)

  return (
    <div className="mt-8 border-2 border-dashed border-gray-500 max-w-screen-lg mx-auto p-4">
      <h1 className="-ml-4 -mt-10 text-gray-500 font-semibold">
        DocsRendererPage
      </h1>
      <DocsRendererCell docPath={path} />
    </div>
  )
}

export default DocsRendererPage
