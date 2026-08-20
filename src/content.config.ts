import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const sourceSchema = z.object({
	provider: z.enum(['gcp', 'azure']),
	owner: z.literal('MasanaoAsato'),
	repository: z.enum(['google-cloud-learning', 'azure-learning']),
	architectureId: z.string().min(1),
	revision: z.string().regex(/^[0-9a-f]{40}$/),
});

const cloudSchema = z.enum(['gcp', 'azure']);
const themeSchema = z.enum(['web', 'container', 'network', 'data']);

const blogPosts = defineCollection({
	loader: glob({
		pattern: '**/*.md',
		base: './src/content/blog',
		generateId: ({ entry }) => entry.replace(/\.md$/, ''),
	}),
	schema: z.object({
		title: z.string().min(1),
		description: z.string().min(1),
		publishedAt: z.coerce.date(),
		tags: z.array(z.string().trim().min(1)).min(1),
		draft: z.boolean().default(false),
	}),
});

const architectureDetails = defineCollection({
	loader: glob({
		pattern: '**/*.md',
		base: './src/content/architectures',
		generateId: ({ entry }) => entry.replace(/\.md$/, ''),
	}),
	schema: z.object({
		title: z.string().min(1),
		cloud: cloudSchema,
		themes: z.array(themeSchema).min(1),
		services: z.array(z.string().min(1)).min(1),
		featured: z.boolean(),
		sortOrder: z.number().int().nonnegative(),
		spotlight: z
			.object({
				label: z.string().min(1),
				description: z.string().min(1),
			})
			.optional(),
		description: z.string().min(1),
		source: sourceSchema,
		diagram: z.string().startsWith('/'),
		diagramAlt: z.string().min(1),
	}),
});

export const collections = {
	architectureDetails,
	blogPosts,
};
