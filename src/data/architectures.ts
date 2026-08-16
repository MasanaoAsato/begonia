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

export interface HeroCaseStudyConfig {
	architectureId: ArchitectureSummary['id'];
	label: string;
	description: string;
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
		title: 'Cloud Runの公開入口を設計する',
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

// ヒーローで紹介するケースと、選定理由をここで一緒に管理する。
export const heroCaseStudy: HeroCaseStudyConfig = {
	architectureId: 'gcp-serverless-api',
	label: '注目のケーススタディ',
	description: '構成図・要件・判断・実装を、ひとつの実例として読めます。',
};
