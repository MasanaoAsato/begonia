import type { Env } from '../env';

export type AnalyticsPageView = {
	postSlug: string;
	date: string;
	views: number;
};

type AnalyticsGroup = {
	count?: number | null;
	dimensions?: {
		datetime?: string | null;
		requestPath?: string | null;
	};
};

type AnalyticsPayload = {
	data?: {
		viewer?: {
			accounts?: Array<{
				rumWebAnalyticsAdaptiveGroups?: AnalyticsGroup[];
			}>;
		};
	};
	errors?: Array<{ message?: string }>;
};

type AnalyticsFetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

const graphqlEndpoint = 'https://api.cloudflare.com/client/v4/graphql';

const pageViewsQuery = `
	query BlogPageViews(
		$accountTag: String!
		$siteTag: String!
		$datetimeGeq: Time!
		$datetimeLt: Time!
	) {
		viewer {
			accounts(filter: { accountTag: $accountTag }) {
				rumWebAnalyticsAdaptiveGroups(
					limit: 10000
					filter: {
					siteTag: $siteTag
						datetime_geq: $datetimeGeq
						datetime_lt: $datetimeLt
					}
					orderBy: [datetime_ASC]
				) {
					count
					dimensions {
						datetime
						requestPath
					}
				}
			}
		}
	}
`;

const toPostSlug = (requestPath: string | null | undefined): string | null => {
	if (!requestPath?.startsWith('/blog/') || !requestPath.endsWith('/')) {
		return null;
	}

	const postSlug = requestPath.slice('/blog/'.length, -1);
	return postSlug.length > 0 ? postSlug : null;
};

const toDate = (datetime: string | null | undefined, fallback: string) => {
	if (!datetime) {
		return fallback;
	}

	const date = datetime.slice(0, 10);
	return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : fallback;
};

const toCount = (count: number | null | undefined) => {
	if (typeof count !== 'number' || !Number.isFinite(count) || count < 0) {
		return null;
	}

	return Math.floor(count);
};

export const fetchAnalyticsPageViews = async (
	env: Pick<
		Env,
		'CLOUDFLARE_ACCOUNT_ID' | 'CLOUDFLARE_API_TOKEN' | 'CLOUDFLARE_WEB_ANALYTICS_SITE_TAG'
	>,
	startDate: string,
	endDate: string,
	fetcher: AnalyticsFetcher = globalThis.fetch,
): Promise<AnalyticsPageView[]> => {
	const response = await fetcher(graphqlEndpoint, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query: pageViewsQuery,
			variables: {
				accountTag: env.CLOUDFLARE_ACCOUNT_ID,
				siteTag: env.CLOUDFLARE_WEB_ANALYTICS_SITE_TAG,
				datetimeGeq: `${startDate}T00:00:00Z`,
				datetimeLt: `${endDate}T00:00:00Z`,
			},
		}),
	});

	if (!response.ok) {
		throw new Error(`Cloudflare Analytics request failed with status ${response.status}`);
	}

	const payload = (await response.json()) as AnalyticsPayload;

	if (payload.errors?.length) {
		throw new Error(
			payload.errors.map(({ message }) => message ?? 'unknown GraphQL error').join('; '),
		);
	}

	const accounts = payload.data?.viewer?.accounts;

	if (!accounts?.length) {
		throw new Error('Cloudflare Analytics response did not contain account data');
	}

	const groups = accounts.flatMap((account) => account.rumWebAnalyticsAdaptiveGroups ?? []);

	const dailyViews = new Map<string, AnalyticsPageView>();

	for (const group of groups) {
		const postSlug = toPostSlug(group.dimensions?.requestPath);
		const views = toCount(group.count);

		if (!postSlug || views === null) {
			continue;
		}

		const date = toDate(group.dimensions?.datetime, startDate);
		const key = `${postSlug}${String.fromCharCode(0)}${date}`;
		const previous = dailyViews.get(key);

		dailyViews.set(key, {
			postSlug,
			date,
			views: (previous?.views ?? 0) + views,
		});
	}

	return [...dailyViews.values()];
};
