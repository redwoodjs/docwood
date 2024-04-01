import DocsRendererCell from './DocsRendererCell/DocsRendererCell'

const DocsRendererPage = ({ path }) => {
  console.info('DocsRendererPage', path)

  return (
    <div>
      <h1>DocsRendererPage</h1>
      <p>path: {path}</p>
      <DocsRendererCell docPath={path} />
    </div>
  )
}

export default DocsRendererPage
