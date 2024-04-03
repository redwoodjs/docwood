import fs from 'node:fs'
import path from 'node:path'

import { FolderIcon, DocumentIcon } from '@heroicons/react/24/outline'
import { noCase } from 'change-case'
import fm from 'front-matter'
import toTitleCase from 'titlecase'

import { DOCS_ROOT_PATH } from 'src/lib/paths'

const CustomIndexComponent = (docPath) => {
  // get all files/directories in this path
  const contents = fs.readdirSync(path.join(DOCS_ROOT_PATH, docPath))
  const links = contents
    .map((filename) => {
      const descriptor = {
        title: toTitleCase(noCase(filename.replace('.md', ''))),
        description: '',
        path: path.join(docPath, filename.replace('.md', '')),
        type: filename.match(/\.md$/) ? 'file' : 'directory',
      }

      if (fs.lstatSync(path.join(DOCS_ROOT_PATH, docPath, filename)).isFile()) {
        const file = fs.readFileSync(
          path.join(DOCS_ROOT_PATH, docPath, filename),
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

  // the title is whatever the last part of the URL is, titlecased
  // Example: /docs/deployment/cloudHosting -> Cloud Hosting
  const title = toTitleCase(noCase(docPath.split('/').pop()))

  const Component = () => {
    return (
      <>
        <h1>{title}</h1>
        <dl className="my-4">
          {links.map((link) => (
            <>
              <dt key={link.path} className="flex items-center space-x-2">
                {link.type === 'directory' ? (
                  <FolderIcon className="w-5 h-5 text-gray-600" />
                ) : (
                  <DocumentIcon className="w-5 h-5 text-gray-600" />
                )}
                <a href={`/docs/${link.path}`} className="font-semibold">
                  {link.title}
                </a>
              </dt>
              <dd className="ml-7 mb-4">{link.description}</dd>
            </>
          ))}
        </dl>
      </>
    )
  }

  return Component
}

export default CustomIndexComponent
