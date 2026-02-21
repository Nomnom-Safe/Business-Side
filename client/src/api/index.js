import jsonRequest from './client';

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

const api = {
	auth: authApi,
	businesses: businessesApi,
	menus: menusApi,
	menuItems: menuItemsApi,
	allergens: allergensApi,
	addresses: addressesApi,
};

export default api;
