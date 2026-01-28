const mongoose = require('mongoose');
const { Schema } = mongoose;

class MenuItem {
  constructor(name, ingredients=[], allergens = [], description = '', menuIDs = []) {
    this.name = name;
    this.ingredients = ingredients;
    this.description = description;
    this.allergens = allergens;
    this.menuIDs = menuIDs
  }
}

const MenuItemSchema = new Schema({
  name: String, // String is shorthand for {type: String}
  ingredients: [String],
  description: String,
  allergens: [String],
  menuIDs: [String]
});

MenuItemSchema.loadClass(MenuItem);

module.exports = mongoose.model('MenuItem', MenuItemSchema);