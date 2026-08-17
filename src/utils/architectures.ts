import type { CollectionEntry } from 'astro:content';

export type ArchitectureDetailEntry = CollectionEntry<'architectureDetails'>;

export type ArchitectureSummary = Pick<
	ArchitectureDetailEntry['data'],
	'cloud' | 'themes' | 'title' | 'services'
> & {
	id: ArchitectureDetailEntry['id'];
};

export const caseStudyHeadings = [
	'想定シナリオ',
	'設計判断',
	'コスト試算',
	'セキュリティと運用',
	'学習スコープと本番化への差分',
] as const;

const sourceConfiguration = {
	gcp: {
		provider: 'gcp',
		repository: 'google-cloud-learning',
		publicProvider: 'google-cloud',
	},
	azure: {
		provider: 'azure',
		repository: 'azure-learning',
		publicProvider: 'azure',
	},
} as const;

const cloudLabels = {
	gcp: 'Google Cloud',
	azure: 'Azure',
} satisfies Record<ArchitectureSummary['cloud'], string>;

const themeLabels = {
	web: 'Web / API',
	container: 'コンテナ',
	network: 'ネットワーク',
	data: 'データ基盤',
} satisfies Record<ArchitectureDetailEntry['data']['themes'][number], string>;

export const getArchitectureSummary = (entry: ArchitectureDetailEntry): ArchitectureSummary => ({
	id: entry.id,
	cloud: entry.data.cloud,
	themes: entry.data.themes,
	title: entry.data.title,
	services: entry.data.services,
});

export const getArchitectureDetailUrl = ({ id }: Pick<ArchitectureSummary, 'id'>) =>
	`/architectures/${id}/`;

export const getCloudLabel = (cloud: ArchitectureSummary['cloud']) => cloudLabels[cloud];

export const getThemeLabel = (theme: ArchitectureDetailEntry['data']['themes'][number]) =>
	themeLabels[theme];

export const sortArchitectureEntries = (entries: ArchitectureDetailEntry[]) =>
	[...entries].sort((left, right) => left.data.sortOrder - right.data.sortOrder);

export const validateArchitectureEntries = (entries: ArchitectureDetailEntry[]) => {
	const sortOrders = new Set<number>();

	for (const entry of entries) {
		if (sortOrders.has(entry.data.sortOrder)) {
			throw new Error(`sortOrder は重複できません: ${entry.data.sortOrder}`);
		}
		sortOrders.add(entry.data.sortOrder);

		const expectedSource = sourceConfiguration[entry.data.cloud];
		if (entry.data.source.provider !== expectedSource.provider) {
			throw new Error(`cloud と source.provider が一致しません: ${entry.id}`);
		}
		if (entry.data.source.repository !== expectedSource.repository) {
			throw new Error(`cloud と source.repository が一致しません: ${entry.id}`);
		}

		const expectedId = `${expectedSource.publicProvider}/${entry.data.source.architectureId}`;
		if (entry.id !== expectedId) {
			throw new Error(`詳細IDと source.architectureId が一致しません: ${entry.id}`);
		}
	}

	const spotlightCount = entries.filter((entry) => entry.data.spotlight).length;
	if (spotlightCount !== 1) {
		throw new Error(`spotlight は1件だけ設定してください: ${spotlightCount}件`);
	}
};
