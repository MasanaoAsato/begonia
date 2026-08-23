import type { BlogStats } from '../../shared/blog-engagement-contract';
import type { D1DatabaseLike } from '../env';

type StatsRow = {
	views: number | null;
	likes: number | null;
	liked: number | null;
};

export type DailyStats = {
	postSlug: string;
	date: string;
	views: number;
};

const statsQuery = `
	SELECT
		COALESCE((SELECT SUM(views) FROM post_daily_stats WHERE post_slug = ?1), 0) AS views,
		(SELECT COUNT(*) FROM likes WHERE post_slug = ?1) AS likes,
		EXISTS(
			SELECT 1 FROM likes
			WHERE post_slug = ?1 AND visitor_id = ?2
		) AS liked
`;

const toCount = (value: number | null | undefined) => {
	if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
		return 0;
	}

	return Math.floor(value);
};

export const getBlogStats = async (
	database: D1DatabaseLike,
	postSlug: string,
	visitorId: string,
): Promise<BlogStats> => {
	const row = await database.prepare(statsQuery).bind(postSlug, visitorId).first<StatsRow>();

	return {
		views: toCount(row?.views),
		likes: toCount(row?.likes),
		liked: row?.liked === 1,
	};
};

export const addLike = async (
	database: D1DatabaseLike,
	postSlug: string,
	visitorId: string,
): Promise<BlogStats> => {
	await database
		.prepare(
			`INSERT INTO likes (post_slug, visitor_id)
			 VALUES (?, ?)
			 ON CONFLICT(post_slug, visitor_id) DO NOTHING`,
		)
		.bind(postSlug, visitorId)
		.run();

	return getBlogStats(database, postSlug, visitorId);
};

export const removeLike = async (
	database: D1DatabaseLike,
	postSlug: string,
	visitorId: string,
): Promise<BlogStats> => {
	await database
		.prepare('DELETE FROM likes WHERE post_slug = ? AND visitor_id = ?')
		.bind(postSlug, visitorId)
		.run();

	return getBlogStats(database, postSlug, visitorId);
};

export const upsertDailyStats = async (
	database: D1DatabaseLike,
	stats: DailyStats[],
): Promise<void> => {
	if (stats.length === 0) {
		return;
	}

	const statements = stats.map(({ postSlug, date, views }) =>
		database
			.prepare(
				`INSERT INTO post_daily_stats (post_slug, date, views)
				 VALUES (?, ?, ?)
				 ON CONFLICT(post_slug, date) DO UPDATE SET views = excluded.views`,
			)
			.bind(postSlug, date, views),
	);

	await database.batch(statements);
};
