import fs from 'node:fs/promises'
import path from 'node:path'

import fm from 'front-matter'

import { ROOT_DIST_PATH } from './paths'
import {
  DocumentTree,
  DocumentTreeBranch,
  DocumentTreeLeaf,
  DocumentTreeNode,
} from './types'
import { getLink, getTitle, getType, isBuildArtifact } from './util'

let documentTree: DocumentTree | undefined
let documentMap: Map<string, DocumentTreeNode> | undefined

export async function getDocumentTree() {
  if (documentTree) {
    return documentTree
  }

  documentMap = new Map()
  documentTree = await buildDocumentTree(ROOT_DIST_PATH)
  return documentTree
}

export async function getDocumentMap() {
  if (documentTree) {
    return documentMap
  }

  documentMap = new Map()
  documentTree = await getDocumentTree()
  return documentMap
}

async function buildDocumentTree(directory: string): Promise<DocumentTree> {
  const lstat = await fs.lstat(directory)
  if (!lstat.isDirectory()) {
    throw new Error(`Expected ${directory} to be a directory`)
  }

  const items = await fs.readdir(directory)
  const tree: DocumentTree = []
  for (const item of items) {
    const itemPath = path.join(directory, item)
    const lstat = await fs.lstat(itemPath)

    if (lstat.isDirectory()) {
      const children = await buildDocumentTree(itemPath)
      const node: DocumentTreeBranch = {
        path: itemPath,
        link: getLink(itemPath),
        title: getTitle(itemPath),
        type: 'directory',
        children,
      }

      tree.push(node)
      documentMap.set(node.link, node)
    } else if (lstat.isFile()) {
      if (await isBuildArtifact(itemPath)) {
        continue
      }

      const node: DocumentTreeLeaf = {
        path: itemPath,
        link: getLink(itemPath),
        title: getTitle(itemPath),
        type: getType(itemPath),
      }

      tree.push(node)
      documentMap.set(node.link, node)
    }
  }

  return tree
}

export async function getDocumentTreeToDepth(depth: number) {
  const tree = await getDocumentTree()
  return getChildrenUpToDepth(tree, depth, 0)
}

function getChildrenUpToDepth(
  tree: DocumentTree,
  depth: number,
  currentDepth: number
): DocumentTree {
  if (currentDepth >= depth) {
    return []
  }

  return tree.map((node) => {
    if (node.type === 'directory') {
      return {
        ...node,
        children: getChildrenUpToDepth(node.children, depth, currentDepth + 1),
      }
    }

    return node
  })
}

export async function getTableOfContents(node: DocumentTreeNode) {
  if (node.type === 'mdx') {
    const { tableOfContents } = await import(/* @vite-ignore */ node.path)
    return tableOfContents
  }

  if (node.type === 'md') {
    const content = await fs.readFile(node.path, 'utf-8')
    const { compile } = await import('@mdx-js/mdx')
    const { default: withToc } = await import(
      '@stefanprobst/rehype-extract-toc'
    )
    const { body } = fm(content)
    const res = await compile(body, { rehypePlugins: [[withToc]] })
    return res.data.toc
  }

  // TODO: Handle the case for a directory
  return []
}

export async function getTableOfContentsToDepth(
  node: DocumentTreeNode,
  depth: number
) {
  const stripToDepth = (toc, depth) => {
    const stippedToc = []
    for (const item of toc) {
      if (item.depth <= depth) {
        stippedToc.push({
          ...item,
          children: stripToDepth(item.children ?? [], depth),
        })
      }
    }
    return stippedToc
  }

  const toc = await getTableOfContents(node)
  return stripToDepth(toc, depth)
}
