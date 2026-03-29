import jsonRequest from './client';
import { API_BASE_URL } from './config';

export const authApi = {
	signUp: async (payload) =>
		jsonRequest('/api/auth/signup', {
			method: 'POST',
			body: payload,
			includeCredentials: true,
		}),

	signIn: async (payload) =>
		jsonRequest('/api/auth/signin', {
			method: 'POST',
			body: payload,
			includeCredentials: true,
		}),

	logout: async () =>
		jsonRequest('/api/auth/logout', {
			method: 'POST',
			includeCredentials: true,
		}),

	editLogin: async (payload) =>
		jsonRequest('/api/auth/edit-login', {
			method: 'POST',
			body: payload,
			includeCredentials: true,
		}),

	setBusiness: async (payload) =>
		jsonRequest('/api/auth/set-business', {
			method: 'POST',
			body: payload,
			includeCredentials: true,
		}),
};

export const businessesApi = {
	list: async () =>
		jsonRequest('/api/businesses/', {
			method: 'GET',
			includeCredentials: true,
		}),

	create: async (payload) =>
		jsonRequest('/api/businesses', {
			method: 'POST',
			body: payload,
			includeCredentials: true,
		}),

	getById: async (businessId) =>
		jsonRequest(`/api/businesses/${businessId}`, {
			method: 'GET',
		}),

	update: async (businessId, payload) =>
		jsonRequest(`/api/businesses/${businessId}`, {
			method: 'PUT',
			body: payload,
		}),
};

export const menusApi = {
	update: async (menuId, payload) =>
		jsonRequest(`/api/menus/${menuId}`, {
			method: 'PUT',
			body: payload,
		}),

	ensureForBusiness: async (businessId) =>
		jsonRequest('/api/menus/ensure', {
			method: 'POST',
			body: { businessId },
		}),

	updateTitleDescription: async (payload) =>
		jsonRequest('/api/menus/update-title-description', {
			method: 'PUT',
			body: payload,
		}),
};

export const menuItemsApi = {
	getMenuForBusiness: async (businessId) =>
		jsonRequest(`/api/menuitems/menu?businessId=${businessId}`, {
			method: 'GET',
		}),

	getByMenuId: async (menuId) =>
		jsonRequest(`/api/menuitems?menuID=${menuId}`, {
			method: 'GET',
		}),

	updateItem: async (id, payload) =>
		jsonRequest(`/api/menuitems/${id}`, {
			method: 'PUT',
			body: payload,
		}),

	deleteItem: async (id) =>
		jsonRequest(`/api/menuitems/${id}`, {
			method: 'DELETE',
		}),

	addMenuItem: async (payload) =>
		jsonRequest('/api/menuitems/add-menu-item', {
			method: 'POST',
			body: payload,
		}),
};

export const allergensApi = {
	list: async () =>
		jsonRequest('/api/allergens', {
			method: 'GET',
		}),
};

export const categoriesApi = {
	list: async (businessId) =>
		jsonRequest(`/api/businesses/${businessId}/categories`, {
			method: 'GET',
		}),

	create: async (businessId, payload) =>
		jsonRequest(`/api/businesses/${businessId}/categories`, {
			method: 'POST',
			body: payload,
		}),

	update: async (businessId, categoryId, payload) =>
		jsonRequest(`/api/businesses/${businessId}/categories/${categoryId}`, {
			method: 'PUT',
			body: payload,
		}),

	delete: async (businessId, categoryId) =>
		jsonRequest(`/api/businesses/${businessId}/categories/${categoryId}`, {
			method: 'DELETE',
		}),
};

export const addressesApi = {
	list: async () =>
		jsonRequest('/api/addresses', {
			method: 'GET',
		}),

	getById: async (id) =>
		jsonRequest(`/api/addresses/${id}`, {
			method: 'GET',
		}),

	create: async (payload) =>
		jsonRequest('/api/addresses', {
			method: 'POST',
			body: payload,
		}),

	update: async (id, payload) =>
		jsonRequest(`/api/addresses/${id}`, {
			method: 'PUT',
			body: payload,
		}),

	delete: async (id) =>
		jsonRequest(`/api/addresses/${id}`, {
			method: 'DELETE',
		}),
};

export const placesApi = {
	autocomplete: async (input, sessionToken = '') => {
		const params = new URLSearchParams({ input });
		if (sessionToken) params.set('sessionToken', sessionToken);
		return jsonRequest(`/api/places/autocomplete?${params.toString()}`, {
			method: 'GET',
			includeCredentials: true,
		});
	},
	details: async (placeId) =>
		jsonRequest(`/api/places/details?place_id=${encodeURIComponent(placeId)}`, {
			method: 'GET',
			includeCredentials: true,
		}),
};

export const menuImportApi = {
	importFile: async (file) => {
		const formData = new FormData();
		formData.append('file', file);
		let response;
		let data = null;
		try {
			response = await fetch(`${API_BASE_URL}/api/menu/import/file`, {
				method: 'POST',
				body: formData,
				// Do NOT set Content-Type — browser sets it with the multipart boundary automatically
			});
			try {
				data = await response.json();
			} catch (e) {
				// ignore JSON parse errors
			}
		} catch (networkError) {
			return {
				ok: false,
				status: 0,
				data: null,
				message: networkError.message || 'Network error',
			};
		}
		return {
			ok: response.ok,
			status: response.status,
			data,
			message: data?.message,
		};
	},
};

const api = {
	auth: authApi,
	businesses: businessesApi,
	menus: menusApi,
	menuItems: menuItemsApi,
	allergens: allergensApi,
	categories: categoriesApi,
	addresses: addressesApi,
	places: placesApi,
	menuImport: menuImportApi,
};

export default api;
