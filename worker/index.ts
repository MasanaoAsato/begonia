import { getAnalyticsSyncWindow, syncAnalyticsViews } from './analytics/sync';
import { handlePostEngagement } from './api/post-engagement';
import type { WorkerHandler } from './env';

const isApiRequest = (request: Request) => new URL(request.url).pathname.startsWith('/api/');

const worker: WorkerHandler = {
	fetch(request, env) {
		if (isApiRequest(request)) {
			return handlePostEngagement(request, env);
		}

		return env.ASSETS.fetch(request);
	},

	async scheduled(controller, env) {
		const window = getAnalyticsSyncWindow(new Date(controller.scheduledTime));

		try {
			await syncAnalyticsViews(env, new Date(controller.scheduledTime));
			console.info('blog analytics sync completed', {
				cron: controller.cron,
				previousDate: window.previousDate,
				currentDate: window.currentDate,
			});
		} catch (error) {
			console.error('blog analytics sync failed; D1 was not updated', {
				cron: controller.cron,
				previousDate: window.previousDate,
				currentDate: window.currentDate,
				error,
			});
		}
	},
};

export default worker;
