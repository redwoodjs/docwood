import { defineEntries } from '@redwoodjs/vite/entries'

export default defineEntries(
  // getEntry
  async (id) => {
    switch (id) {
      case 'HomePage':
        return import('./pages/HomePage/HomePage')
      case 'DocsRendererPage':
        return import('./pages/DocsRendererPage/DocsRendererPage')
      default:
        return null
    }
  }
)
