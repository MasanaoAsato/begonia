export type Cloud = 'azure' | 'gcp' | 'compare';

export interface ArchitectureSummary {
	id: string;
	cloud: Cloud;
	themes: string[];
	title: string;
	services: string[];
	featured: boolean;
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
		title: 'サーバーレスAPI基盤',
		services: ['Cloud Run', 'Pub/Sub', 'Firestore'],
		featured: true,
	},
	{
		id: 'azure-gcp-web-comparison',
		cloud: 'compare',
		themes: ['web'],
		title: '同一要件をどう組むか: Web編',
		services: ['Azure × GCP 徹底比較'],
		featured: true,
	},
];
