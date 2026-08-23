import {
	type BlogStats,
	getPostLikesUrl,
	getPostStatsUrl,
	isBlogStats,
} from '../../shared/blog-engagement-contract';

const numberFormatter = new Intl.NumberFormat('ja-JP');

const setStatus = (element: HTMLElement, message: string, state?: 'error') => {
	element.textContent = message;

	if (state) {
		element.dataset.state = state;
	} else {
		delete element.dataset.state;
	}
};

const initializeEngagement = (root: HTMLElement) => {
	const postId = root.dataset.postId;
	const viewsElement = root.querySelector<HTMLElement>('[data-engagement-views]');
	const likesElement = root.querySelector<HTMLElement>('[data-engagement-likes]');
	const likeButton = root.querySelector<HTMLButtonElement>('[data-engagement-like]');
	const likeIcon = root.querySelector<HTMLElement>('[data-engagement-like-icon]');
	const likeLabel = root.querySelector<HTMLElement>('[data-engagement-like-label]');
	const statusElement = root.querySelector<HTMLElement>('[data-engagement-status]');

	if (
		!postId ||
		!viewsElement ||
		!likesElement ||
		!likeButton ||
		!likeIcon ||
		!likeLabel ||
		!statusElement
	) {
		return;
	}

	let stats: BlogStats | null = null;
	let busy = false;

	const renderStats = (nextStats: BlogStats) => {
		stats = nextStats;
		viewsElement.textContent = numberFormatter.format(nextStats.views);
		likesElement.textContent = numberFormatter.format(nextStats.likes);
		likeButton.disabled = false;
		likeButton.setAttribute('aria-pressed', String(nextStats.liked));
		likeIcon.textContent = nextStats.liked ? '♥' : '♡';
		likeLabel.textContent = nextStats.liked ? 'いいねを解除' : 'いいねする';
	};

	const requestStats = async (url: string, method = 'GET') => {
		const response = await fetch(url, {
			credentials: 'same-origin',
			headers: { Accept: 'application/json' },
			method,
		});

		if (!response.ok) {
			throw new Error(`Engagement API returned ${response.status}`);
		}

		const body: unknown = await response.json();

		if (!isBlogStats(body)) {
			throw new Error('Engagement API returned an invalid response');
		}

		return body;
	};

	const setRetryState = () => {
		likeButton.disabled = false;
		likeButton.setAttribute('aria-pressed', 'false');
		likeIcon.textContent = '↻';
		likeLabel.textContent = '再読み込み';
	};

	const loadStats = async () => {
		if (busy) {
			return;
		}

		busy = true;
		likeButton.disabled = true;
		setStatus(statusElement, '');

		try {
			renderStats(await requestStats(getPostStatsUrl(postId)));
		} catch {
			setRetryState();
			setStatus(statusElement, '統計を読み込めませんでした。再読み込みしてください。', 'error');
		} finally {
			busy = false;
		}
	};

	likeButton.addEventListener('click', async () => {
		if (busy) {
			return;
		}

		if (!stats) {
			await loadStats();
			return;
		}

		busy = true;
		likeButton.disabled = true;
		const nextLiked = !stats.liked;
		setStatus(statusElement, nextLiked ? 'いいねを登録しています…' : 'いいねを解除しています…');

		try {
			renderStats(await requestStats(getPostLikesUrl(postId), nextLiked ? 'POST' : 'DELETE'));
			setStatus(statusElement, nextLiked ? 'いいねしました。' : 'いいねを解除しました。');
		} catch {
			likeButton.disabled = false;
			setStatus(statusElement, 'いいねを更新できませんでした。もう一度お試しください。', 'error');
		} finally {
			busy = false;
		}
	});

	void loadStats();
};

document.querySelectorAll<HTMLElement>('[data-blog-engagement]').forEach((root) => {
	initializeEngagement(root);
});
