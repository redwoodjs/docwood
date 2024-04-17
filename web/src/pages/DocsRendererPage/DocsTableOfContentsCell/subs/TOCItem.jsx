'use client'

export const TOCItem = ({ node }) => {
  const id = node.value.toLowerCase().replaceAll(' ', '-').replaceAll('.', '')
  return (
    <>
      <button
        onClick={() => {
          document.getElementById(id).scrollIntoView({
            behavior: 'smooth',
          })
        }}
        className="w-full text-left"
      >
        {node.value}
      </button>
      {node.children.map((child) => (
        <TOCItem key={child.value + child.depth} node={child} />
      ))}
    </>
  )
}
