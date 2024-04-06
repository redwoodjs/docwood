import { getDocumentMap, getDocumentTree } from 'src/lib/docs'

export const data = async () => {
  const tree = await getDocumentTree()
  const map = await getDocumentMap()
  return { tree, map }
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

export const Success = ({ tree, map }: Awaited<ReturnType<typeof data>>) => {
  return (
    <>
      <div className="m-4 border-2 border-blue-800 p-4">
        <p className="font-semibold">Map</p>
        <pre className="text-sm">{JSON.stringify(map, undefined, 2)}</pre>
      </div>
      <div className="m-4 border-2 border-green-800">
        <p className="font-semibold">Tree</p>
        <pre className="text-sm">{JSON.stringify(tree, undefined, 2)}</pre>
      </div>
    </>
  )
}
