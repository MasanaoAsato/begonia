CREATE TABLE IF NOT EXISTS likes (
	post_slug TEXT NOT NULL,
	visitor_id TEXT NOT NULL,
	created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (post_slug, visitor_id)
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS post_daily_stats (
	post_slug TEXT NOT NULL,
	date TEXT NOT NULL,
	views INTEGER NOT NULL CHECK (views >= 0),
	PRIMARY KEY (post_slug, date)
) WITHOUT ROWID;
