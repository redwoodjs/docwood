// Copies the docs down from redwoodjs/redwood to the local filesystem, moving
// into some directories that mirrors the organization of the current docs site

const { execSync } = require('child_process')
const fs = require('node:fs')
const path = require('node:path')

const LOCAL_DOCS_PATH = path.join(__dirname, '..', 'docs')
const LOCAL_DOCS_CONTENT_HOME = path.join(LOCAL_DOCS_PATH, 'content')
const PACKAGE_JSON = `{
  "name": "docs",
  "version": "0.0.0",
  "private": true,
  "dependencies": {
    "react-player": "2.15.1"
  },
  "packageManager": "yarn@4.1.1"
}
`

const main = async () => {
  const randomString = Math.random().toString(36).substring(2, 15)
  const repoName = `redwood-${randomString}`
  const repoPath = path.join('/', 'tmp', repoName)
  const remoteDocsPath = path.join(repoPath, 'docs', 'docs')

  // remove any existing docs
  console.info('Removing existing docs...')
  execSync(`git clean -x -f ${LOCAL_DOCS_PATH}`)

  // checkout latest docs
  execSync(
    `git clone --depth=1 https://github.com/redwoodjs/redwood.git ${repoPath}`
  )

  console.info('Copying files...')

  // for now, write a new package.json as if it was in the one in the remote repo
  // execSync(
  //   `cp -R ${path.join(repoPath, 'docs', 'package.json')} ${LOCAL_DOCS_PATH}`
  // )
  fs.writeFileSync(path.join(LOCAL_DOCS_PATH, 'package.json'), PACKAGE_JSON)

  // create dirs
  execSync(`mkdir -p ${path.join(LOCAL_DOCS_CONTENT_HOME, '02_tutorial')}`)
  execSync(`mkdir -p ${path.join(LOCAL_DOCS_CONTENT_HOME, '03_reference')}`)
  execSync(`mkdir -p ${path.join(LOCAL_DOCS_CONTENT_HOME, '04_how-to')}`)

  // copy over files
  execSync(
    `cp -f ${path.join(remoteDocsPath, 'introduction.md')} ${path.join(LOCAL_DOCS_CONTENT_HOME, 'index.md')}`
  )
  execSync(
    `cp -f ${path.join(remoteDocsPath, 'quick-start.md')} ${path.join(LOCAL_DOCS_CONTENT_HOME, '01_quick-start.md')}`
  )
  execSync(
    `cp -f ${path.join(remoteDocsPath, 'tutorial', 'foreword.md')} ${path.join(LOCAL_DOCS_CONTENT_HOME, '02_tutorial', '01_foreword.md')}`
  )
  execSync(
    `cp -f ${path.join(remoteDocsPath, 'tutorial', 'intermission.md')} ${path.join(LOCAL_DOCS_CONTENT_HOME, '02_tutorial', '06_intermission.md')}`
  )

  let chapterCount = 2
  ;[
    'chapter0',
    'chapter1',
    'chapter2',
    'chapter3',
    'chapter4',
    'chapter5',
    'chapter6',
    'chapter7',
  ].forEach((chapter) => {
    execSync(
      `cp -rf ${path.join(remoteDocsPath, 'tutorial', chapter)} ${path.join(LOCAL_DOCS_CONTENT_HOME, '02_tutorial', `${chapterCount >= 10 ? chapterCount : '0' + chapterCount}_${chapter}`)}`
    )
    chapterCount++
    if (chapterCount === 6) {
      chapterCount++
    }
  })
  execSync(
    `cp -f ${path.join(remoteDocsPath, 'tutorial', 'afterword.md')} ${path.join(LOCAL_DOCS_CONTENT_HOME, '02_tutorial', '11_afterword.md')}`
  )
  execSync(
    `mv -f ${path.join(remoteDocsPath, 'how-to', '*')} ${path.join(LOCAL_DOCS_CONTENT_HOME, '04_how-to')}`
  )
  execSync(
    `cp -rf ${path.join(remoteDocsPath) + '/'} ${path.join(LOCAL_DOCS_CONTENT_HOME, '03_reference')}`
  )

  console.info('Installing dependencies...')
  execSync(`yarn install`)

  // cleanup checkout
  console.info('Cleaning up...')
  execSync(`rm -rf ${repoPath}`)

  console.info('Done!\n')
  process.exit(0)
}

main()
