import { Link, routes } from '@redwoodjs/router'

const HomePage = () => {
  return (
    <>
      <h1 className="text-2xl font-semibold">RedwoodJS Docs</h1>
      <a href="/docs" className="text-blue-600 underline">
        Documentation
      </a>
    </>
  )
}

export default HomePage
