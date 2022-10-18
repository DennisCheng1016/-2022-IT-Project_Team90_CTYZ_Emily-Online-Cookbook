const express = require('express');
const cartRouter = express.Router();
const {
	getCartList,
	addToCart,
	check,
	deleteIngredient,
	deleteAll,
} = require('../controllers/cartController');
cartRouter.route('/').get(getCartList).delete(deleteAll);
cartRouter.route('/:id').post(addToCart).patch(check).delete(deleteIngredient);

module.exports = cartRouter;
