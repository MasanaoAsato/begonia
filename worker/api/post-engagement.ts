import { decodePostId, type EngagementApiErrorCode } from '../../shared/blog-engagement-contract';
import { addLike, getBlogStats, removeLike } from '../data/engagement-repository';
import type { Env } from '../env';
import { getVisitorIdentity } from '../visitor';

type EngagementRoute = {
	postId: string;
	resource: 'stats' | 'likes';
};

type ParsedRoute = EngagementRoute | { invalidPostId: true } | null;

const routePattern = /^\/api\/posts\/(.+)\/(stats|likes)$/;

const parseRoute = (pathname: string): ParsedRoute => {
	const match = pathname.match(routePattern);

	if (!match) {
		return null;
	}

	const postId = decodePostId(match[1]);
	if (!postId) {
		return { invalidPostId: true };
	}

	return {
		postId,
		resource: match[2] as EngagementRoute['resource'],
	};
};

const jsonResponse = (
	body: unknown,
	status: number,
	setCookie: string | null = null,
	extraHeaders: Record<string, string> = {},
) => {
	const headers = new Headers({
		'Cache-Control': 'no-store',
		'Content-Type': 'application/json; charset=utf-8',
		...extraHeaders,
	});

	if (setCookie) {
		headers.set('Set-Cookie', setCookie);
	}

	return new Response(JSON.stringify(body), { status, headers });
};

const errorResponse = (
	code: EngagementApiErrorCode,
	status: number,
	setCookie: string | null = null,
	extraHeaders: Record<string, string> = {},
) => jsonResponse({ error: code }, status, setCookie, extraHeaders);

const notFoundResponse = () =>
	jsonResponse({ error: 'not_found' }, 404, null, { Allow: 'GET, POST, DELETE' });

export const handlePostEngagement = async (request: Request, env: Env): Promise<Response> => {
	const url = new URL(request.url);
	const route = parseRoute(url.pathname);

	if (!route) {
		return notFoundResponse();
	}

	const visitor = getVisitorIdentity(request);

	if ('invalidPostId' in route) {
		return errorResponse('invalid_post_id', 400, visitor.setCookie);
	}

	if (route.resource === 'stats' && request.method !== 'GET') {
		return errorResponse('method_not_allowed', 405, visitor.setCookie, {
			Allow: 'GET',
		});
	}

	if (route.resource === 'likes' && !['POST', 'DELETE'].includes(request.method)) {
		return errorResponse('method_not_allowed', 405, visitor.setCookie, {
			Allow: 'POST, DELETE',
		});
	}

	try {
		const stats =
			route.resource === 'stats'
				? await getBlogStats(env.BLOG_DB, route.postId, visitor.id)
				: request.method === 'POST'
					? await addLike(env.BLOG_DB, route.postId, visitor.id)
					: await removeLike(env.BLOG_DB, route.postId, visitor.id);

		return jsonResponse(stats, 200, visitor.setCookie);
	} catch (error) {
		console.error('blog engagement request failed', {
			method: request.method,
			path: url.pathname,
			error,
		});

		return errorResponse('service_unavailable', 503, visitor.setCookie);
	}
};
