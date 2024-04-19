'use client'

export const TOCItem = ({ node }) => {
  const id = node.value.toLowerCase().replaceAll(' ', '-').replaceAll('.', '')
  return (
    <li className="my-1 leading-4">
      <a href={`#${id}`}>{node.value}</a>
      {node.children.length > 0 && (
        <ul>
        <ul className="list-none border-l border-gray-300 pl-2">
          {node.children.map((child) => (
            <TOCItem key={child.value + child.depth} node={child} />
          ))}
        </ul>
      )}
    </li>
  )
}
