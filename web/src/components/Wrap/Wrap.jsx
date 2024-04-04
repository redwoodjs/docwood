import clsx from 'clsx'

const Wrap = ({ title, children }) => {
  return (
    <div className="mx-auto mt-8 border border-dashed border-gray-400 p-4">
      <h1 className="-ml-4 -mt-9 text-sm font-semibold text-gray-400">
        {title}
      </h1>
      {children}
    </div>
  )
}

export default Wrap
