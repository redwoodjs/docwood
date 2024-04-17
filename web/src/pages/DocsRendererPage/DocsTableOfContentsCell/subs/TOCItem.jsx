'use client'

export const TOCItem = ({ node }) => {
  const id = node.value.toLowerCase().replaceAll(' ', '-').replaceAll('.', '')
  return (
    <li>
      <a href={`#${id}`}>{node.value}</a>
      {node.children.length > 0 && (
        <ul>
          {node.children.map((child) => (
            <TOCItem key={child.value + child.depth} node={child} />
          ))}
        </ul>
      )}
    </li>
  )
}
