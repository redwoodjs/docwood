import fs from 'node:fs'
import path from 'node:path'

import { noCase } from 'change-case'
import fm from 'front-matter'
import toTitleCase from 'titlecase'

import Wrap from 'src/components/Wrap/Wrap'
import { DOCS_ROOT_PATH } from 'src/lib/paths'

const filenameToTitle = (filename) => {
  // remove extension
  let output = filename.replace(/\.mdx?/, '')
  // remove leading numbers for sorting
  output = output.replace(/^\d+_/, '')
  // turns "camelCase" into "camel case"
  output = noCase(output)
  // turns "lowercase words" into "Title Case Words"
  output = toTitleCase(output)

  return output
}

const filesToLinks = (docPath, depth) => {
  // only go 2 levels deep for now
  if (depth > 2) return null

  const contents = fs.readdirSync(docPath)

  const links = contents.map((filename) => {
    const docPathWithoutRoot = docPath.replace(DOCS_ROOT_PATH, '')

    // don't create nav links for index pages, the parent directory will handle
    // also don't create them for jsx/tsx files
    if (filename.match(/index\.mdx?/) || filename.match(/\.[jt]sx$/)) {
      return null
    }

    // creates a barebones descriptor for the markdown file
    const descriptor = {
      title: filenameToTitle(filename),
      path:
        '/' +
        path.join('docs', docPathWithoutRoot, filename.replace(/\.mdx?/, '')),
      type: filename.match(/\.mdx?$/) ? 'file' : 'directory',
      children: [],
    }

    if (fs.lstatSync(path.join(docPath, filename)).isDirectory()) {
      // if it's a directory, recurse
      descriptor.children = filesToLinks(
        path.join(docPath, filename),
        depth + 1
      )
    } else {
      // if it's a file, get the title from the frontmatter if possible
      const file = fs.readFileSync(path.join(docPath, filename), 'utf8')
      const { attributes } = fm(file)
      descriptor.title = attributes.title || descriptor.title
    }

    return descriptor
  })

  return links.filter((link) => link)
}

export const data = () => {
  return { links: filesToLinks(DOCS_ROOT_PATH, 1) }
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
    <Wrap title="DocsNavigationCell" level={3}>
      <nav>
        <ul className="flex flex-col space-y-2">
          <li>
            <a href="/docs" className="text-sm font-semibold">
              Home
            </a>
          </li>
          {links.map((link) => (
            <li key={link.path}>
              <a href={link.path} className="text-sm font-semibold">
                {link.title}
              </a>
              {link.children.length > 0 && (
                <ul
                  key={`${link.path}-sub`}
                  className="flex flex-col space-y-1 border-l border-gray-300 pl-2 text-sm"
                >
                  {link.children.map((child) => (
                    <li key={child.path}>
                      <a href={child.path}>{child.title}</a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </Wrap>
  )
}
