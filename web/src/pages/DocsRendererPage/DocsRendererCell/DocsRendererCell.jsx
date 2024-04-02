import fs from 'node:fs'
import path from 'node:path'

import fm from 'front-matter'
import Markdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import { titleCase } from 'title-case'

const ROOT_PATH = path.join('dist', 'rsc', 'docs')

const buildIndexPage = (docPath) => {
  // get all files/directories in this path
  const contents = fs.readdirSync(path.join(ROOT_PATH, docPath))
  const links = contents
    .map((filename) => {
      const descriptor = {
        title: titleCase(filename.replace('.md', '')),
        description: '',
        path: path.join(docPath, filename.replace('.md', '')),
        type: filename.match(/\.md$/) ? 'file' : 'directory',
      }

      if (fs.lstatSync(path.join(ROOT_PATH, docPath, filename)).isFile()) {
        const file = fs.readFileSync(
          path.join(ROOT_PATH, docPath, filename),
          'utf8'
        )
        // get frontmatter
        const { attributes } = fm(file)
        // override defaults with frontmatter attributes (if present)
        descriptor.title = attributes.title || descriptor.title
        descriptor.description =
          attributes.description || descriptor.description
      }

      return descriptor
    })
    .filter((data) => data !== null)

  // create markdown as if this was an index.md file that existed in the file system
  const title = titleCase(docPath.split('/').pop())
  let markdown = `---\ntitle: ${title}\n---\n\n# ${title}\n\n`

  for (const link of links) {
    if (link.type === 'directory') {
      markdown += `(dir) `
    } else {
      markdown += `(file) `
    }

    markdown += `**[${link.title}](/docs/${link.path})**\n`
    markdown += `${link.description}\n\n`
  }

  return markdown
}

export const data = ({ docPath }) => {
  // if docPath is undefined, assume `index`
  let filePath = path.join(ROOT_PATH, `${docPath || 'index'}.md`)

  const fileExists = fs.existsSync(filePath)

  // path doesn't exist, check if maybe `index` does instead
  if (!fileExists) {
    filePath = path.join(ROOT_PATH, docPath, 'index.md')
  }

  let file

  // if that doesn't exist, create an index page on the fly with links to the sub pages
  if (!fs.existsSync(filePath)) {
    file = buildIndexPage(docPath)
  } else {
    file = fs.readFileSync(filePath, 'utf8')
  }

  return { ...fm(file) }
}

export const Loading = () => {
  return <div>Docs loading...</div>
}

export const Failure = ({ error }) => {
  return (
    <>
      <div>Doc page not found!</div>
      <p className="text-red-600">{JSON.stringify(error.message)}</p>
    </>
  )
}

export const Success = ({ attributes, body }) => {
  return (
    <div className="mt-8 border-2 border-dashed border-gray-400 p-4">
      <h2 className="-ml-4 -mt-10 text-gray-400 font-semibold">
        DocsRendererCell
      </h2>

      <div className="mt-8 border-2 border-dashed border-gray-300 p-4">
        <h3 className="-ml-4 -mt-10 text-gray-300 font-semibold">Markdown</h3>
        <Markdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          className="markdown my-4"
        >
          {body}
        </Markdown>
      </div>

      <p className="my-4 text-sm">
        Markdown Front Matter:{' '}
        <span className="font-mono text-sm text-gray-600">
          {JSON.stringify(attributes)}
        </span>
      </p>
    </div>
  )
}
