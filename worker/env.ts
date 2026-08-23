export interface D1ResultLike {
	success: boolean;
	meta?: Record<string, unknown>;
}

export interface D1PreparedStatementLike {
	bind(...values: unknown[]): D1PreparedStatementLike;
	first<T extends Record<string, unknown>>(column?: string): Promise<T | null>;
	run(): Promise<D1ResultLike>;
}

export interface D1DatabaseLike {
	prepare(query: string): D1PreparedStatementLike;
	batch(statements: D1PreparedStatementLike[]): Promise<D1ResultLike[]>;
}

export interface AssetsBinding {
	fetch(request: Request): Response | Promise<Response>;
}

export interface Env {
	ASSETS: AssetsBinding;
	BLOG_DB: D1DatabaseLike;
	CLOUDFLARE_ACCOUNT_ID: string;
	CLOUDFLARE_API_TOKEN: string;
	CLOUDFLARE_WEB_ANALYTICS_SITE_TAG: string;
}

export interface ScheduledController {
	cron: string;
	scheduledTime: number;
}

export interface ExecutionContext {
	waitUntil(promise: Promise<unknown>): void;
	passThroughOnException?(): void;
}

export interface WorkerHandler {
	fetch(request: Request, env: Env, context: ExecutionContext): Response | Promise<Response>;
	scheduled(
		controller: ScheduledController,
		env: Env,
		context: ExecutionContext,
	): void | Promise<void>;
}
