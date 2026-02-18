import api from '../api';

let cache = null;
let fetchInProgress = null;

async function fetchAllergensFromServer() {
	const result = await api.allergens.list();
	if (!result.ok || !Array.isArray(result.data)) {
		throw new Error('Failed to fetch allergens');
	}
	const arr = result.data;
	const map = {};
	arr.forEach((a) => {
		map[a.id] = a.label || a.label === 0 ? a.label : a.id;
	});
	return { arr, map };
}

export async function getAllergens() {
	if (cache) return cache;
	if (!fetchInProgress) fetchInProgress = fetchAllergensFromServer();
	cache = await fetchInProgress;
	fetchInProgress = null;
	return cache;
}

export async function getAllergenLabel(id) {
	if (!id) return id;
	const { map } = await getAllergens();
	return map[id] || id;
}

export async function getAllergenLabels(ids = []) {
	if (!Array.isArray(ids) || ids.length === 0) return [];
	const { map } = await getAllergens();
	return ids.map((id) => map[id] || id);
}

export async function resolveLabelsToIDs(labels = []) {
	if (!Array.isArray(labels)) return [];

	const { arr } = await getAllergens(); // arr = [{ id, label }, ...]

	return labels.map((label) => {
		const match = arr.find(
			(a) => a.label.toLowerCase() === label.toLowerCase(),
		);
		return match ? match.id : label.toLowerCase(); // fallback
	});
}

export function clearAllergenCache() {
	cache = null;
}
