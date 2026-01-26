const mongoose = require('mongoose');
const { Schema } = mongoose;

class Business {
	constructor(name, url, address, allergens = [], diets = [], menus = []) {
		this.name = name;
		this.url = url;
		this.address = address;
		this.allergens = allergens;
		this.diets = diets;
		this.menus = menus;
	}
}

const BusinessSchema = new Schema({
	name: { type: String, required: true, unique: true },
	url: { type: String },
	address: { type: String },
	allergens: {
		type: [String],
		default: [],
	},
	diets: { type: [String] },
	menus: [{ type: Schema.Types.ObjectId, ref: 'Menu' }],
});

BusinessSchema.loadClass(Business);

module.exports = mongoose.model('Business', BusinessSchema);
