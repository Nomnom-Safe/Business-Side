// client/src/utils/formValidation.js

const format = {};

format.validateEmail = (email) => {
	if (!email) return false;
	const normalized = email.toLowerCase();
	const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

	return regex.test(normalized);
};

format.validatePassword = (password) => {
	if (typeof password !== 'string') return false;
	return password.length >= 6;
};

// Generic \"required\" validator for non-empty strings
format.isRequired = (value) => {
	if (value === null || value === undefined) return false;
	if (typeof value === 'string') {
		return value.trim().length > 0;
	}
	return true;
};

// Optional minimum length validator for strings
format.minLength = (value, min) => {
	if (typeof value !== 'string') return false;
	return value.length >= min;
};

// Optional basic URL validator (very lenient, behavior-preserving)
format.isValidUrl = (value) => {
	if (!value || typeof value !== 'string') return true; // treat empty as valid (optional field)
	try {
		// Will throw for clearly invalid URLs; allow relative/simple URLs by default
		// but reject obvious garbage without a dot.
		// This keeps behavior close to \"no validation\" while catching egregious cases.
		if (!value.includes('.')) return false;
		// eslint-disable-next-line no-new
		new URL(value.startsWith('http') ? value : `https://${value}`);
		return true;
	} catch (e) {
		return false;
	}
};

export default format;
