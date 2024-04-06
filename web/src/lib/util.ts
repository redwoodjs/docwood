import fs from 'node:fs/promises'
import path from 'node:path'

import { noCase } from 'change-case'
import toTitleCase from 'titlecase'

import { ROOT_DIST_PATH, ROOT_SRC_PATH } from './paths'
import { DocumentTreeLeaf } from './types'

export function getLink(p: string): string {
  const link = p.substring(
    ROOT_SRC_PATH.length + 7,
    p.length - path.extname(p).length
  )
  return link.endsWith('/index') ? link.substring(0, link.length - 6) : link
}

export function getTitle(p: string): string {
  const filename = path.basename(p, path.extname(p))

  let output = filename.replace(/^\d+_/, '')
  // turns "camelCase" into "camel case"
  output = noCase(output)
  // turns "lowercase words" into "Title Case Words"
  output = toTitleCase(output)

  return output
}

export function getType(p: string): DocumentTreeLeaf['type'] {
  return p.endsWith('.md') ? 'md' : 'mdx'
}

export async function isBuildArtifact(p: string): Promise<boolean> {
  const distExtension = path.extname(p)
  if (distExtension !== '.mjs') {
    return false
  }

  const distWithoutExtension = p.substring(0, p.length - distExtension.length)
  const srcWithoutExtension = distWithoutExtension.replace(
    ROOT_DIST_PATH,
    ROOT_SRC_PATH
  )
  const srcWithExtension = `${srcWithoutExtension}.mdx`

  let exists = false
  try {
    await fs.access(srcWithExtension)
    exists = true
  } catch (_e) {
    // ignore
  }

  return !exists
}
