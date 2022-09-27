const Category = require('../models/Category');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const getCategories = async (req, res) => {
	const categories = await Category.find({ createBy: req.user.userId });
	res.status(200).json({ categories });
};

const createCategory = async (req, res) => {
	req.body.createBy = req.user.userId;
	const category = await Category.create(req.body);
	res.status(StatusCodes.CREATED).json({ category });
};

const updateCategory = async (req, res) => {
	const {
		body: { name },
		params: { id: categoryId },
	} = req;
	if (name === '') throw new BadRequestError('Name cannot be empty');
	const category = await Category.findOneAndUpdate(
		{ _id: categoryId },
		req.body,
		{ new: true, runValidators: true }
	);
	if (!category) throw new NotFoundError(`No category with id ${categoryId}`);
	res.status(StatusCodes.OK).json({ category });
};

const deleteCategory = async (req, res) => {
	const {
		user: { _id: userId },
		params: { id: categoryId },
	} = req;

	const category = await Category.findByIdAndRemove({
		_id: categoryId,
		createdBy: userId,
	});
	if (!category) {
		throw new NotFoundError(`No category with id ${categoryId}`);
	}
	res.status(StatusCodes.OK).send();
};

module.exports = {
	getCategories,
	createCategory,
	updateCategory,
	deleteCategory,
};
