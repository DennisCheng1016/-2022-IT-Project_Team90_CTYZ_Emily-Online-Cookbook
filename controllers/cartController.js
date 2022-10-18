const { StatusCodes } = require('http-status-codes');
const { NotFoundError } = require('../errors');
const Cart = require('../models/Cart');
const Recipe = require('../models/Recipe');

const getCartList = async (req, res) => {
	const ingredients = await Cart.find({ user: req.user.userId }).select(
		'ingredient check'
	);
	res.status(StatusCodes.OK).json(ingredients);
};

const addToCart = async (req, res) => {
	const {
		params: { id: recipeId },
	} = req;
	const recipe = await Recipe.findOne({
		_id: recipeId,
		createBy: req.user.userId,
	});
	if (!recipe) throw new NotFoundError(`No recipe with id ${recipeId}`);
	for (const ingredient of recipe.ingredients) {
		await Cart.create({ user: req.user.userId, ingredient: ingredient });
	}
	res.status(StatusCodes.CREATED).send();
};

const check = async (req, res) => {
	const {
		params: { id: ingredientId },
	} = req;
	const ingredient = await Cart.findOneAndUpdate(
		{ _id: ingredientId },
		[{ $set: { check: { $not: '$check' } } }],
		{ new: true, runValidators: true }
	).select('-__v');
	if (!ingredient)
		throw new NotFoundError(`No ingredient with id ${ingredientId}`);
	res.status(StatusCodes.OK).json(ingredient);
};

const deleteIngredient = async (req, res) => {
	const {
		params: { id: ingredientId },
	} = req;
	const ingredient = await Cart.findOneAndDelete({
		_id: ingredientId,
	});
	if (!ingredient)
		throw new NotFoundError(`No ingredient with id ${ingredientId}`);
	res.status(StatusCodes.OK).send();
};

const deleteAll = async (req, res) => {
	await Cart.deleteMany({ user: req.user.userId });
	res.status(StatusCodes.OK).send();
};

module.exports = {
	getCartList,
	addToCart,
	check,
	deleteIngredient,
	deleteAll,
};
