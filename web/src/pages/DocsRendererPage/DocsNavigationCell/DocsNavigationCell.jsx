import fs from 'node:fs'
import path from 'node:path'

import { noCase } from 'change-case'
import fm from 'front-matter'
import toTitleCase from 'titlecase'

import { DOCS_ROOT_PATH } from 'src/lib/paths'

const filesToLinks = (docPath, depth) => {
  // only go 2 levels deep for now
  if (depth > 2) return null

  const contents = fs.readdirSync(docPath)

  const links = contents.map((filename) => {
    const descriptor = {
      title: toTitleCase(noCase(filename.replace('.md', ''))),
      path: path.join(filename.replace('.md', '')),
      type: filename.match(/\.md$/) ? 'file' : 'directory',
      children: [],
    }

    if (fs.lstatSync(path.join(docPath, filename)).isDirectory()) {
      descriptor.children = filesToLinks(
        path.join(docPath, filename),
        depth + 1
      )
    } else {
      const file = fs.readFileSync(path.join(docPath, filename), 'utf8')
      const { attributes } = fm(file)
      descriptor.title = attributes.title || descriptor.title
    }

    return descriptor
  })

  return links
}

export const data = () => {
  const links = filesToLinks(DOCS_ROOT_PATH, 1).filter((data) => data !== null)

  return { links: links }
}

export const Loading = () => {
  return <div>Loading nav...</div>
}

export const Failure = ({ error }) => {
  return (
    <>
      <div>Could not load navigation:</div>
      <p className="text-red-600">{JSON.stringify(error.message)}</p>
    </>
  )
}

export const Success = ({ links }) => {
  return (
    <div className="mt-8 border-2 border-dashed border-gray-500 p-4">
      <h1 className="-ml-4 -mt-10 text-gray-600 font-semibold">
        DocsNavigationCell
      </h1>

      <nav>
        <ul className="flex flex-col space-y-2">
          {links.map((link) => (
            <li key={link.path}>
              <a href={`/docs/${link.path}`} className="text-sm font-semibold">
                {link.title}
              </a>
              {link.children.length > 0 && (
                <ul
                  key={`${link.path}-sub`}
                  className="flex flex-col space-y-1 text-sm pl-2 border-l border-gray-300"
                >
                  {link.children.map((child) => (
                    <li key={child.path}>
                      <a href={`/docs/${child.path}`}>{child.title}</a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
