'use client'

import { evaluate } from '@mdx-js/mdx'
import * as jsxRuntime from 'react/jsx-runtime'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'

const ClientMdxRenderer = async ({ mdx }: { mdx: string }) => {
  const MdxComponent = (
    await evaluate(mdx, {
      ...jsxRuntime,
      baseUrl: import.meta.url,
      remarkPlugins: [remarkGfm, remarkBreaks],
    })
  ).default

  return <MdxComponent />
}

export default ClientMdxRenderer
