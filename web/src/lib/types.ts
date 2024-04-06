export type DocumentTree = DocumentTreeNode[]

export type DocumentTreeNode = DocumentTreeBranch | DocumentTreeLeaf

export type DocumentTreeCommon = {
  path: string
  title: string
  link: string
}

export type DocumentTreeBranch = DocumentTreeCommon & {
  type: 'directory'
  children: DocumentTree
}

export type DocumentTreeLeaf = DocumentTreeCommon & {
  type: 'md' | 'mdx'
}
