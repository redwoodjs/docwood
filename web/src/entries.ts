import { defineEntries } from '@redwoodjs/vite/entries'

export default defineEntries(
  // getEntry
  async (id) => {
    switch (id) {
      case 'HomePage':
        return import('./pages/HomePage/HomePage')
      case 'DocsRendererPage':
        return import('./pages/DocsRendererPage/DocsRendererPage')
      case 'DebugPage':
        return import('./pages/DebugPage/DebugPage')
      default:
        return null
    }
  }
)
