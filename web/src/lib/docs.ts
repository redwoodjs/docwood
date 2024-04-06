import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { noCase } from 'change-case'
import toTitleCase from 'titlecase'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const ROOT_SRC_PATH = path.resolve(__dirname, '..', 'docs')
const ROOT_DIST_PATH = path.resolve(
  __dirname,
  '..',
  '..',
  'dist',
  'rsc',
  'assets',
  'docs'
)

type DocumentTree = DocumentTreeNode[]
type DocumentTreeNode = {
  path: string
  link: string
  title: string
  index: boolean
  type: 'virtual' | 'md' | 'mdx' | 'directory'
  children?: DocumentTree
}

let documentTree: DocumentTree = []
let documentTreeMap: Map<string, DocumentTreeNode> = new Map<
  string,
  DocumentTreeNode
>()

export async function getDocumentTree() {
  if (documentTree.length > 0) {
    return documentTree
  }

  documentTreeMap = new Map<string, DocumentTreeNode>()
  documentTree = await buildDocumenTreeAndMap(ROOT_DIST_PATH)

  return documentTree
}

export async function getDocumentMap() {
  await getDocumentTree()
  return documentTreeMap
}

// TODO(jgmw): We should not await promises inside the loop like we do
async function buildDocumenTreeAndMap(cwd: string): Promise<DocumentTree> {
  const lstat = await fs.lstat(cwd)
  if (!lstat.isDirectory()) {
    return []
  }

  const tree: DocumentTree = []
  const items = await fs.readdir(cwd)
  for (const item of items) {
    const itemPath = path.join(cwd, item)
    const lstat = await fs.lstat(itemPath)
    if (lstat.isDirectory()) {
      const children = await buildDocumenTreeAndMap(itemPath)

      const node = {
        ...getDocumentNodeDetails(itemPath, true),
        children,
      }
      tree.push(node)
      documentTreeMap[node.link] = node

      // If no index exists insert a virtual one
      if (
        children.length > 0 &&
        children.find((child) => child.index) === undefined
      ) {
        const node = getVirtualDocumentNodeDetails(itemPath)
        children.push(node)
        documentTreeMap[node.link] = node
      }
    } else {
      if (!item.match(/\.md$/)) {
        // Ensure there was a .mdx file in the source
        const itemExtension = path.extname(item)
        const distCwd = cwd.replace(ROOT_DIST_PATH, ROOT_SRC_PATH)
        const distItem = path.join(distCwd, item.replace(itemExtension, '.mdx'))
        try {
          const distItemLstat = await fs.lstat(distItem)
          if (!distItemLstat.isFile()) {
            continue
          }
        } catch (e) {
          if (e.code === 'ENOENT') {
            continue
          }
          throw e
        }
      }

      const node = getDocumentNodeDetails(itemPath, false)
      tree.push(node)
      documentTreeMap[node.link] = node
    }
  }

  return tree
}

function getDocumentNodeDetails(
  itemPath: string,
  isDirectory: boolean
): Omit<DocumentTreeNode, 'children'> {
  return {
    path: itemPath,
    title: filenameToTitle(path.basename(itemPath)),
    index: path.basename(itemPath).startsWith('index.'),
    type: isDirectory
      ? 'directory'
      : path.extname(itemPath).startsWith('.mjs')
        ? 'mdx'
        : 'md',
    link: pathToLink(itemPath),
  }
}

function getVirtualDocumentNodeDetails(
  itemPath: string
): Omit<DocumentTreeNode, 'children'> {
  return {
    path: itemPath,
    title: filenameToTitle(path.basename(itemPath)),
    index: true,
    type: 'virtual',
    link: pathToLink(itemPath),
  }
}

function filenameToTitle(filename: string): string {
  // remove extension
  let output = filename.replace(path.extname(filename), '')
  // remove leading numbers for sorting
  output = output.replace(/^\d+_/, '')
  // turns "camelCase" into "camel case"
  output = noCase(output)
  // turns "lowercase words" into "Title Case Words"
  output = toTitleCase(output)

  return output
}

function pathToLink(p: string): string {
  const prefixStripped = p.substring(ROOT_DIST_PATH.length - 5)
  const extStripped = prefixStripped.replace(path.extname(prefixStripped), '')
  return extStripped.endsWith('/index')
    ? extStripped.substring(0, extStripped.length - 5)
    : extStripped
}

export function getChildrenUpToDepth(
  tree: DocumentTree,
  depth: number
): DocumentTree {
  if (depth === 0) {
    return []
  }

  return tree.map((node) => {
    return {
      ...node,
      children: getChildrenUpToDepth(node.children ?? [], depth - 1),
    }
  })
}

export async function getNodeByLink(
  link: string
): Promise<DocumentTreeNode | undefined> {
  return (await getDocumentMap())[link]
}
