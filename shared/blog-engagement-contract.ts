export type BlogStats = {
	views: number;
	likes: number;
	liked: boolean;
};

export type EngagementApiErrorCode =
	| 'invalid_post_id'
	| 'method_not_allowed'
	| 'service_unavailable';

export type EngagementApiError = {
	error: EngagementApiErrorCode;
};

export type EngagementApiResponse = BlogStats | EngagementApiError;

const apiBasePath = (postId: string) => `/api/posts/${encodeURIComponent(postId)}`;

export const getPostStatsUrl = (postId: string) => `${apiBasePath(postId)}/stats`;

export const getPostLikesUrl = (postId: string) => `${apiBasePath(postId)}/likes`;

export const decodePostId = (encodedPostId: string): string | null => {
	try {
		const postId = decodeURIComponent(encodedPostId);

		if (
			postId.length === 0 ||
			postId.startsWith('/') ||
			postId.endsWith('/') ||
			postId.includes(String.fromCharCode(0))
		) {
			return null;
		}

		return postId;
	} catch {
		return null;
	}
};

export const isBlogStats = (value: unknown): value is BlogStats => {
	if (typeof value !== 'object' || value === null) {
		return false;
	}

	const stats = value as Partial<BlogStats>;
	return (
		typeof stats.views === 'number' &&
		Number.isFinite(stats.views) &&
		stats.views >= 0 &&
		typeof stats.likes === 'number' &&
		Number.isFinite(stats.likes) &&
		stats.likes >= 0 &&
		typeof stats.liked === 'boolean'
	);
};
