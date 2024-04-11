import dns from 'dns'
import fs from 'node:fs'
import path from 'node:path'

import { globSync } from 'glob'
import type { InputOption } from 'rollup'
import type { PluginOption } from 'vite'
import { defineConfig } from 'vite'

import redwood from '@redwoodjs/vite'

// So that Vite will load on localhost instead of `127.0.0.1`.
// See: https://vitejs.dev/config/server-options.html#server-host.
dns.setDefaultResultOrder('verbatim')

function docwood({
  docsRootPath,
  docsStaticAssets,
  docsMdxAssets,
  docsJsAssets,
}: {
  docsRootPath: string
  docsStaticAssets: string[]
  docsMdxAssets: string[]
  docsJsAssets: string[]
}): PluginOption {
  return {
    name: 'docwood',
    config(config, env) {
      const outDir = config.build?.outDir ?? ''
      const buildMode = getBuildMode(env.isSsrBuild ?? false, outDir)

      if (buildMode === 'rsc') {
        const dynamicAssets = [...docsMdxAssets, ...docsJsAssets]
        const docsInputs = Object.fromEntries(
          dynamicAssets.map((file) => {
            console.info('file', file)
            const name =
              'docs/' +
              file.substring(
                docsRootPath.length + 1,
                file.lastIndexOf(path.extname(file))
              )
            console.info('name', name)
            return [name, file]
          })
        )

        return {
          build: {
            rollupOptions: {
              input: mergeInput(config.build?.rollupOptions?.input, docsInputs),
            },
          },
        }
      }

      if (buildMode === 'client') {
        const docsInputs = Object.fromEntries(
          docsJsAssets.map((file) => {
            const name =
              'docs/' +
              file.substring(
                docsRootPath.length + 1,
                file.lastIndexOf(path.extname(file))
              )
            return [name, file]
          })
        )

        return {
          build: {
            rollupOptions: {
              input: mergeInput(config.build?.rollupOptions?.input, docsInputs),
            },
          },
        }
      }

      return null
    },
    writeBundle(options, _bundle) {
      if (!options.dir || !options.dir.endsWith('rsc')) {
        return
      }
      for (const asset of docsStaticAssets) {
        const outputPath = path.join(
          options.dir,
          'assets',
          'docs',
          asset.substring(docsRootPath.length + 1)
        )
        const outputDir = path.dirname(outputPath)
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true })
        }
        fs.copyFileSync(asset, outputPath)
      }
    },
  }
}

function getBuildMode(
  ssr: boolean,
  outDir: string
): 'client' | 'rsc' | 'unknown' {
  if (!ssr && outDir.endsWith(path.join('web', 'dist', 'client'))) {
    return 'client'
  }
  if (ssr && outDir.endsWith(path.join('web', 'dist', 'rsc'))) {
    return 'rsc'
  }
  return 'unknown'
}

function mergeInput(
  input: InputOption | undefined,
  docsInputs: Record<string, string>
): InputOption | undefined {
  if (!input) {
    return docsInputs
  }

  if (typeof input === 'string') {
    return { ...docsInputs, [input]: input }
  }

  if (Array.isArray(input)) {
    const asObject = Object.fromEntries(input.map((entry) => [entry, entry]))
    return { ...asObject, ...docsInputs }
  }

  return { ...input, ...docsInputs }
}

async function mdxWrapper(exclude: string[]): Promise<PluginOption> {
  const { default: mdx } = await import('@mdx-js/rollup')
  const { default: remarkBreaks } = await import('remark-breaks')
  const { default: remarkGfm } = await import('remark-gfm')
  const { default: remarkDirective } = await import('remark-directive')
  const { default: remarkCalloutDirectives } = await import(
    '@microflash/remark-callout-directives'
  )
  const { default: remarkFrontmatter } = await import('remark-frontmatter')
  const { default: rehypeRaw } = await import('rehype-raw')

  const original = mdx({
    remarkPlugins: [
      [remarkGfm],
      [remarkBreaks],
      [remarkDirective],
      [remarkCalloutDirectives, { aliases: { info: 'note' } }],
      [remarkFrontmatter],
    ],
    rehypePlugins: [
      [
        rehypeRaw,
        {
          passThrough: [
            'mdxjsEsm',
            'mdxFlowExpression',
            'mdxJsxFlowElement',
            'mdxJsxTextElement',
            'mdxTextExpression',
          ],
        },
      ],
    ],
  })
  return {
    ...original,
    name: 'mdxWrapper',
    transform(code, id) {
      if (exclude.includes(id)) {
        return code
      }
      return original.transform(code, id)
    },
  }
}

export default defineConfig(async () => {
  const docsRootPath = path.join(__dirname, '..', 'docs', 'content')
  const docsAssets = globSync(path.join(docsRootPath, '**', '*.*'))
  const docsMdxAssets = docsAssets.filter(
    (file) => path.extname(file) === '.mdx'
  )
  const docsJsAssets = docsAssets.filter((file) =>
    ['.js', '.jsx', '.ts', '.tsx'].includes(path.extname(file))
  )
  const docsStaticAssets = docsAssets.filter(
    (file) => ![...docsJsAssets, ...docsMdxAssets].includes(file)
  )

  const mdxw = await mdxWrapper(
    docsAssets.filter((file) => !['.mdx'].includes(path.extname(file)))
  )

  return {
    plugins: [
      redwood(),
      docwood({
        docsRootPath,
        docsStaticAssets,
        docsMdxAssets,
        docsJsAssets,
      }),
      mdxw,
    ],
  }
})
