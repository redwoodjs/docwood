const DocsLayout = ({ children }) => {
  return (
    <div className="mt-8 border-2 border-dashed border-gray-600 p-4">
      <h1 className="-ml-4 -mt-10 text-gray-600 font-semibold">DocsLayout</h1>
      <div className="max-w-screen-lg mx-auto">
        <div className="">{children}</div>
      </div>
    </div>
  )
}

export default DocsLayout
