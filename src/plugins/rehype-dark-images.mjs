import { visit } from 'unist-util-visit'

/**
 * Rehype plugin for theme-aware image pairs.
 *
 * A post references a dark variant with the markdown title "dark":
 *
 *   ![Chart](./image.svg)
 *   ![](./image-dark.svg "dark")
 *
 * The dark image is tagged with data-theme-image="dark" (and its preceding
 * sibling with "light"); CSS in post.css swaps them when <html> has .dark.
 * Both images stay plain markdown, so Astro's image optimization applies.
 * Runs before rehype-image-processor so the dark copy never gets a caption.
 */
export default function rehypeDarkImages() {
  return (tree) => {
    // 1. Tag images explicitly marked with title="dark"
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'img' || node.properties?.title !== 'dark') {
        return
      }
      delete node.properties.title
      node.properties = {
        ...node.properties,
        alt: '',
        'data-theme-image': 'dark'
      }
    })

    // 2. Tag the nearest preceding image sibling as the light variant
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'img' || node.properties?.['data-theme-image'] !== 'dark') {
        return
      }
      if (!parent?.children) {
        return
      }

      // Walk backwards past whitespace-only text nodes (markdown newlines)
      for (let i = index - 1; i >= 0; i--) {
        const sibling = parent.children[i]
        if (sibling.type === 'text' && !sibling.value.trim()) {
          continue
        }
        if (sibling.tagName === 'img' && !sibling.properties?.['data-theme-image']) {
          sibling.properties = {
            ...sibling.properties,
            'data-theme-image': 'light'
          }
        }
        break
      }
    })
  }
}
