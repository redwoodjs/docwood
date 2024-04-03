import { DOCS_ROOT_PATH } from 'src/lib/paths'

const fs = require('node:fs')
const path = require('node:path')

const fm = require('front-matter')

const main = () => {
  const docPath = 'deployment'
  const links = fs
    .readdirSync(path.join(DOCS_ROOT_PATH, docPath))
    .map((filename) => {
      // don't worry about directories
      if (!filename.match(/\.md$/)) {
        return null
      }

      // read file so we can look at frontmatter and get the title and description
      const file = fs.readFileSync(
        path.join(DOCS_ROOT_PATH, docPath, filename),
        'utf8'
      )
      const { attributes } = fm(file)

      return {
        title: attributes.title || filename.replace('.md', ''),
        description: attributes.description || '',
        path: path.join(docPath, filename.replace('.md', '')),
      }
    })
    .filter((data) => data !== null)

  let markdown = `---\ntitle: ${docPath.split('/').pop()}\n---\n\n`

  for (const link of links) {
    markdown += `* [${link.title}](/docs/${link.path})\n`
  }

  console.info(markdown)
}

main()
