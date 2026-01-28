var format = {};

format.validateEmail = (email) => {
	email = email.toLowerCase();
	const regex =
		/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

	return regex.test(email);
};

format.validatePassword = (password) => {
	return password.length >= 6;
};

export default format;
