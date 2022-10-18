const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'Please provide user'],
	},
	ingredient: {
		type: String,
		trim: true,
	},
	check: {
		type: Boolean,
		default: false,
	},
});

module.exports = mongoose.model('Cart', CartSchema);
