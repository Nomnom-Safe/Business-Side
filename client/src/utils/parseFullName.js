// client/src/utils/parseFullName.js

export function parseFullName(fullName) {
	if (!fullName) return ['', ''];

	const parts = fullName.trim().split(' ');
	if (parts.length === 1) return [parts[0], ''];

	return [parts[0], parts.slice(1).join(' ')];
}
