// client/src/utils/splitName.js

export function splitName(fullName = '') {
	if (!fullName.trim()) return ['', ''];
	const parts = fullName.trim().split(' ');
	return [parts[0], parts.slice(1).join(' ')];
}
