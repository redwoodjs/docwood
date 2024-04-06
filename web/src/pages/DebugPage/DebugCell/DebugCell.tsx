import { getDocumentTree } from 'src/lib/docs'

export const data = async () => {
  const tree = await getDocumentTree()
  return { tree }
}

export const Loading = () => {
  return <div>Loading data...</div>
}

export const Failure = ({ error }) => {
  return (
    <>
      <div>Could not load data:</div>
      <p className="text-red-600">{JSON.stringify(error.message)}</p>
    </>
  )
}

export const Success = ({ tree }: Awaited<ReturnType<typeof data>>) => {
  return (
    <div className="m-4 border-2 border-green-800 bg-gray-200 p-4">
      <p className="font-semibold">Tree</p>
      <pre className="text-xs">{JSON.stringify(tree, undefined, 2)}</pre>
    </div>
  )
}
