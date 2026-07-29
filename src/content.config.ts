import { glob } from 'astro/loaders'
import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'

function removeDupsAndLowerCase(array: string[]) {
	if (!array.length) return array;
	const lowercaseItems = array.map((str) => str.toLowerCase());
	const distinctItems = new Set(lowercaseItems);
	return Array.from(distinctItems);
}

const posts = defineCollection({
	loader: glob({
		pattern: "**/*.{md,mdx,mdoc}",
		base: "./src/content/posts",
	}),
	// @ts-ignore
	schema: () =>
		z.object({
			
			description: z.string().min(10).max(400),
			draft: z.boolean().default(false),

			logType: z.enum(["reading", "work"]),

			ogImage: z.string().optional(),

			publishDate: z
				.string()
				.or(z.date())
				.transform((val) => new Date(val)),

			tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),

			title: z.string().max(120),

			updatedDate: z
				.string()
				.optional()
				.transform((str) => (str ? new Date(str) : undefined)),
		}),
});

const about = defineCollection({
  // Load Markdown files in the `src/content/about/` directory.
  loader: glob({ base: './src/content/about', pattern: '**/*.md' }),
  // Type-check frontmatter using a schema
  schema: z.object({})
})

export const collections = { posts, about }
