import { visit } from 'unist-util-visit'

const isImg = (n) => n?.type === 'element' && n.tagName === 'img'
const isSpacer = (n) => n.type === 'text' && !n.value.trim()

/** A paragraph/element containing nothing but images and whitespace */
function onlyImages(node) {
  if (node?.type !== 'element' || !node.children?.length) {
    return false
  }
  return node.children.some(isImg) && node.children.every((c) => isImg(c) || isSpacer(c))
}

function firstImgIn(node) {
  if (isImg(node)) {
    return node
  }
  for (const child of node.children || []) {
    const found = firstImgIn(child)
    if (found) {
      return found
    }
  }
  return null
}

function markLight(img) {
  if (img && !img.properties?.['data-theme-image']) {
    img.properties = { ...img.properties, 'data-theme-image': 'light' }
  }
}

/**
 * Rehype plugin for theme-aware image pairs.
 *
 * A post references a dark variant with the markdown title "dark":
 *
 *   ![Chart](./image.svg)
 *   ![](./image-dark.svg "dark")
 *
 * A blank line between the two lines is allowed. The dark image is tagged
 * data-theme-image="dark" and its light partner data-theme-image="light";
 * CSS in post.css swaps them when <html> has .dark. Both images stay plain
 * markdown, so Astro's image optimization applies.
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

    // 2. Pair each dark image with the image-only content directly before it.
    //    Runs on the root as well as every element: MDX puts blank-line-separated
    //    images directly under the root, where visit('element') cannot see them.
    const pairIn = (container) => {
      const children = container.children || []

      children.forEach((child, i) => {
        let dark = null
        if (isImg(child)) {
          if (child.properties?.['data-theme-image'] === 'dark') {
            dark = child
          }
        } else if (onlyImages(child)) {
          const img = firstImgIn(child)
          const imgCount = collectImgs(child).length
          if (img && imgCount === 1 && img.properties?.['data-theme-image'] === 'dark') {
            dark = img
          }
        }
        if (!dark) {
          return
        }

        // walk backwards to the nearest non-spacer sibling; it must be image
        // content (a bare img or an image-only block) to count as the pair
        for (let j = i - 1; j >= 0; j--) {
          const prev = children[j]
          if (isSpacer(prev)) {
            continue
          }
          if (isImg(prev)) {
            markLight(prev)
          } else if (onlyImages(prev)) {
            markLight(firstImgIn(prev))
          }
          break
        }
      })
    }

    pairIn(tree)
    visit(tree, 'element', pairIn)
  }
}

function collectImgs(node) {
  const out = []
  ;(function walk(n) {
    if (isImg(n)) {
      out.push(n)
      return
    }
    for (const c of n.children || []) {
      walk(c)
    }
  })(node)
  return out
}
