export const resolveAssetPath = (path?: string | null) => {
	if (!path) return '';
	const trimmed = path.trim();
	if (!trimmed) return '';
	// Allow absolute URLs or data URIs to pass through untouched
	if (/^(https?:)?\/\//i.test(trimmed) || trimmed.startsWith('data:')) {
		return trimmed;
	}

	// Normalize Windows-style backslashes and remove leading ./ or / characters
	const sanitized = trimmed
		.replace(/\\/g, '/')
		.replace(/^\.\//, '')
		.replace(/^\/+/, '');

	return `/${sanitized}`;
};
