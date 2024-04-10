'use client'

export const Button = () => {
  return (
    <button
      type="button"
      className="rounded bg-blue-500 px-3 py-1 text-sm font-semibold text-white"
      onClick={() => alert('Hello!')}
    >
      Click me!
    </button>
  )
}
