import Wrap from 'src/components/Wrap'

const DocsLayout = ({ children }) => {
  return (
    <div className="mx-auto max-w-screen-xl">
      <Wrap title="DocsLayout" level={1}>
        <div className="">{children}</div>
      </Wrap>
    </div>
  )
}

export default DocsLayout
