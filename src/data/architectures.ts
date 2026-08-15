export type Cloud = 'azure' | 'gcp' | 'compare';

export interface ArchitectureSummary {
	id: string;
	cloud: Cloud;
	themes: string[];
	title: string;
	services: string[];
	featured: boolean;
	detailId?: string;
}

export const architectures: ArchitectureSummary[] = [
	{
		id: 'azure-web-spike',
		cloud: 'azure',
		themes: ['web'],
		title: 'スパイクに耐えるWeb構成',
		services: ['Front Door', 'App Service', 'SQL DB'],
		featured: true,
	},
	{
		id: 'gcp-serverless-api',
		cloud: 'gcp',
		themes: ['web'],
		title: 'Cloud RunをLB経由で公開し、入口を一つに絞る',
		services: ['Cloud Run', 'Load Balancing', 'Cloud Armor'],
		featured: true,
		detailId: 'google-cloud/01',
	},
	{
		id: 'azure-gcp-web-comparison',
		cloud: 'compare',
		themes: ['web'],
		title: '同一要件をどう組むか: Web編',
		services: ['Azure × Google Cloud 徹底比較'],
		featured: true,
	},
];
