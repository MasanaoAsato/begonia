import type { CollectionEntry } from 'astro:content';

export type BlogPostEntry = CollectionEntry<'blogPosts'>;

export type BlogPostSummary = Pick<
	BlogPostEntry['data'],
	'title' | 'description' | 'publishedAt' | 'tags'
> & {
	id: BlogPostEntry['id'];
};

const blogPostDateFormatter = new Intl.DateTimeFormat('ja-JP', {
	dateStyle: 'long',
	timeZone: 'Asia/Tokyo',
});

export const getBlogPostSummary = (entry: BlogPostEntry): BlogPostSummary => ({
	id: entry.id,
	title: entry.data.title,
	description: entry.data.description,
	publishedAt: entry.data.publishedAt,
	tags: entry.data.tags,
});

export const getBlogPostUrl = ({ id }: Pick<BlogPostSummary, 'id'>) => `/blog/${id}/`;

export const formatBlogPostDate = (publishedAt: BlogPostSummary['publishedAt']) =>
	blogPostDateFormatter.format(publishedAt);

export const sortBlogPostsNewestFirst = (entries: BlogPostEntry[]) =>
	[...entries].sort((left, right) => {
		const publishedAtDifference =
			right.data.publishedAt.getTime() - left.data.publishedAt.getTime();
		if (publishedAtDifference !== 0) {
			return publishedAtDifference;
		}

		return left.id.localeCompare(right.id, 'en');
	});

export const getBlogPostsForBuild = (entries: BlogPostEntry[], isProduction: boolean) =>
	sortBlogPostsNewestFirst(entries.filter((entry) => !isProduction || !entry.data.draft));
