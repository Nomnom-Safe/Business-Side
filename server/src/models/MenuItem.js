const mongoose = require('mongoose');
const { Schema } = mongoose;

class MenuItem {
	constructor(
		name,
		ingredients = [],
		allergens = [],
		description = '',
		menuIDs = [],
	) {
		this.name = name;
		this.ingredients = ingredients;
		this.description = description;
		this.allergens = allergens;
		this.menuIDs = menuIDs;
	}
}

// Legacy Mongoose model removed.
// Routes now use Firestore services. If you see an import of this file,
// replace it with the appropriate service in `src/services`.

module.exports = new Proxy(
	{},
	{
		get() {
			throw new Error(
				'Legacy model `MenuItem` removed. Use ../services/menuItemService instead.',
			);
		},
	},
);
