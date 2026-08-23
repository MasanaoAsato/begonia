const visitorCookieName = 'visitor_id';
const visitorIdPattern =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type VisitorIdentity = {
	id: string;
	setCookie: string | null;
};

const isVisitorId = (value: string) => visitorIdPattern.test(value);

const readCookie = (request: Request, name: string): string | null => {
	const cookieHeader = request.headers.get('Cookie');

	if (!cookieHeader) {
		return null;
	}

	for (const part of cookieHeader.split(';')) {
		const separatorIndex = part.indexOf('=');

		if (separatorIndex === -1) {
			continue;
		}

		const key = part.slice(0, separatorIndex).trim();
		if (key !== name) {
			continue;
		}

		const rawValue = part.slice(separatorIndex + 1).trim();

		try {
			return decodeURIComponent(rawValue);
		} catch {
			return null;
		}
	}

	return null;
};

const serializeVisitorCookie = (visitorId: string) =>
	`${visitorCookieName}=${encodeURIComponent(visitorId)}; HttpOnly; Secure; SameSite=Lax; Path=/api/; Max-Age=31536000`;

export const getVisitorIdentity = (request: Request): VisitorIdentity => {
	const existingId = readCookie(request, visitorCookieName);

	if (existingId && isVisitorId(existingId)) {
		return { id: existingId, setCookie: null };
	}

	const id = crypto.randomUUID();
	return { id, setCookie: serializeVisitorCookie(id) };
};
