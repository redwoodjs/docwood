import path from 'node:path'

import { getPaths } from '@redwoodjs/project-config'

// I kept getting the wrong paths randomly, so I just reached for the redwood project
// config package which isn't really supposed to be user facing, but I know about it
// and it makes my life easier
export const ROOT_SRC_PATH = path.join(getPaths().web.src, 'docs')

export const ROOT_DIST_PATH = path.join(
  getPaths().web.distRsc,
  'assets',
  'docs'
)
