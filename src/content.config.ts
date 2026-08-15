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

const architectureDetails = defineCollection({
	loader: glob({
		pattern: '**/*.md',
		base: './src/content/architectures',
		generateId: ({ entry }) => entry.replace(/\.md$/, ''),
	}),
	schema: ({ image }) =>
		z.object({
			description: z.string().min(1),
			source: sourceSchema,
			diagram: image(),
			diagramAlt: z.string().min(1),
		}),
});

export const collections = {
	architectureDetails,
};
