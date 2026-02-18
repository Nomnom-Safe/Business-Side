import { API_BASE_URL } from './config';

async function jsonRequest(path, options = {}) {
	const {
		method = 'GET',
		body,
		includeCredentials = false,
		headers = {},
	} = options;

	const url = `${API_BASE_URL}${path}`;

	const fetchOptions = {
		method,
		headers: {
			'Content-Type': 'application/json',
			...headers,
		},
	};

	if (includeCredentials) {
		fetchOptions.credentials = 'include';
	}

	if (body !== undefined) {
		fetchOptions.body = JSON.stringify(body);
	}

	let response;
	let data = null;

	try {
		response = await fetch(url, fetchOptions);
		try {
			data = await response.json();
		} catch (e) {
			// ignore JSON parse errors, keep data as null
		}
	} catch (networkError) {
		// Network or CORS error; surface a consistent shape
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
}

export default jsonRequest;

