// client/src/hooks/useBreadcrumbs.js

import { useLocation } from 'react-router-dom';
import { LABEL_OVERRIDES } from 'client/src/components/common/Nav/breadcrumbLabels.js';

// Default label resolver (can be replaced via dependency injection)
function defaultResolveLabel(segment) {
	if (!segment) return 'Dashboard';
	return (
		LABEL_OVERRIDES[segment] ||
		segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
	);
}

/**
 * useBreadcrumbs
 *
 * @param {Function} resolveLabel - Optional label resolver function.
 *                                  Defaults to using LABEL_OVERRIDES + formatting.
 */
export function useBreadcrumbs(resolveLabel = defaultResolveLabel) {
	const location = useLocation();
	const parts = location.pathname.split('/').filter(Boolean);

	const crumbs = [];

	if (location.pathname !== '/') {
		crumbs.push({ label: 'Dashboard', path: '/' });
	}

	let currentPath = '';
	parts.forEach((seg) => {
		currentPath = `${currentPath}/${seg}`.replace('//', '/');

		crumbs.push({
			label: resolveLabel(seg),
			path: currentPath,
		});
	});

	return crumbs;
}
