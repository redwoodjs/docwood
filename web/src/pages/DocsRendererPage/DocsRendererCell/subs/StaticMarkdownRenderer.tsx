/* eslint-disable import/order */
import fs from 'node:fs/promises'

import remarkDirective from 'remark-directive'
import remarkCalloutDirectives from '@microflash/remark-callout-directives'
import fm from 'front-matter'
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'

import Wrap from 'src/components/Wrap/Wrap'
import { DocumentTreeNode } from 'src/lib/types'

const StaticMarkdownRenderer = async ({ node }: { node: DocumentTreeNode }) => {
  const content = await fs.readFile(node.path, 'utf-8')
  const { attributes, body } = fm(content)

  return (
    <Wrap title="StaticMarkdownRenderer" level={4}>
      <Markdown
        remarkPlugins={[
          [remarkGfm],
          [remarkBreaks],
          [remarkDirective],
          [remarkCalloutDirectives, { aliases: { info: 'note' } }],
        ]}
        rehypePlugins={[rehypeRaw]}
        className="markdown my-4"
      >
        {body}
      </Markdown>
      <p className="my-6 border-t border-gray-300 pt-4 text-sm text-gray-400">
        Markdown Front Matter:{' '}
        <div className="rounded bg-gray-200 px-2 py-1 font-mono text-xs text-gray-600">
          {JSON.stringify(attributes)}
        </div>
      </p>
    </Wrap>
  )
}

export default StaticMarkdownRenderer
