const mongoose = require('mongoose');
const { Schema } = mongoose;

class Menu {
	constructor(title, restaurantId, description = '') {
		this.title = title;
		this.restaurant = restaurantId;
		this.description = description;
	}
}

const MenuSchema = new Schema({
	title: { type: String, required: true },
	description: { type: String },
	restaurant: {
		type: Schema.Types.ObjectId,
		ref: 'Business',
	},
});

MenuSchema.loadClass(Menu);

// Legacy Mongoose model removed.
// Routes now use Firestore services. If you see an import of this file,
// replace it with the appropriate service in `src/services`.

module.exports = new Proxy(
	{},
	{
		get() {
			throw new Error(
				'Legacy model `Menu` removed. Use ../services/menuService instead.',
			);
		},
	},
);
