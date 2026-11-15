import { getCollection, type CollectionEntry } from 'astro:content'

/**
 * Get all posts, filtering out posts whose filenames start with _,
 * and — in production builds — posts marked draft: true.
 */
export async function getFilteredPosts() {
  const posts = await getCollection('posts')
  const visible = posts.filter((post: CollectionEntry<'posts'>) => !post.id.startsWith('_'))
  return import.meta.env.PROD ? visible.filter((post: CollectionEntry<'posts'>) => !post.data.draft) : visible
}

/**
 * Get all posts sorted by publication date, filtering out posts whose filenames start with _
 */
export async function getSortedFilteredPosts() {
  const posts = await getFilteredPosts()
  return posts.sort(
    (a: CollectionEntry<'posts'>, b: CollectionEntry<'posts'>) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf()
  )
}
