const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

class User {
	constructor(
		first_name,
		last_name,
		email,
		password,
		business_id,
		menu_item_layout,
		admin
	) {
		this.first_name = first_name;
		this.last_name = last_name;
		this.email = email;
		this.password = password;
		this.business_id = business_id;
		this.menu_item_layout = menu_item_layout;
		this.admin = admin;
	}

	// Returns the user's full name
	getFullName() {
		return `${this.first_name} ${this.last_name}`;
	}
}

const UserSchema = new Schema({
	first_name: { type: String, required: true },
	last_name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	business_id: { type: String },
	menu_item_layout: { type: Number },
	admin: { type: Boolean, required: true },
});

// Hash password before saving if password is new or modified
UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		return next();
	}

	try {
		const salt = await bcrypt.genSalt(12);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (err) {
		next(err);
	}
});

// Compares given password w/ hashed password
UserSchema.methods.comparePassword = async function (
	givenPassword
) {
	return bcrypt.compare(givenPassword, this.password);
};

// Returns user's full name
UserSchema.methods.getFullName = function () {
	return `${this.first_name} ${this.last_name}`;
};

UserSchema.loadClass(User);

module.exports = mongoose.model('users', UserSchema);
