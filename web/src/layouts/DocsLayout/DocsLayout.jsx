const DocsLayout = ({ children }) => {
  return (
    <main className="mt-8 border-2 border-dashed border-gray-600 max-w-screen-lg mx-auto p-4">
      <h1 className="-ml-4 -mt-10 text-gray-600 font-semibold">DocsLayout</h1>
      {children}
    </main>
  )
}

export default DocsLayout
