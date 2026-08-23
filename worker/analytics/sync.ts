import { upsertDailyStats } from '../data/engagement-repository';
import type { Env } from '../env';
import { fetchAnalyticsPageViews } from './analytics-client';

const toDateString = (date: Date) => date.toISOString().slice(0, 10);

const addUtcDays = (date: Date, days: number) => {
	const next = new Date(date);
	next.setUTCDate(next.getUTCDate() + days);
	return next;
};

export type AnalyticsSyncWindow = {
	previousDate: string;
	currentDate: string;
	nextDate: string;
};

export const getAnalyticsSyncWindow = (now: Date = new Date()): AnalyticsSyncWindow => {
	const current = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
	const previous = addUtcDays(current, -1);
	const next = addUtcDays(current, 1);

	return {
		previousDate: toDateString(previous),
		currentDate: toDateString(current),
		nextDate: toDateString(next),
	};
};

export const syncAnalyticsViews = async (
	env: Env,
	now: Date = new Date(),
): Promise<AnalyticsSyncWindow> => {
	const window = getAnalyticsSyncWindow(now);
	const pageViews = await fetchAnalyticsPageViews(env, window.previousDate, window.nextDate);
	const dates = new Set([window.previousDate, window.currentDate]);

	await upsertDailyStats(
		env.BLOG_DB,
		pageViews.filter(({ date }) => dates.has(date)),
	);

	return window;
};
