const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');
const Tag = require('../models/Tag');

const getAllTags = async (req, res) => {
	const tags = await Tag.find({ createBy: req.user.userId });
	res.status(StatusCodes.OK).json({ tags, number: tags.length });
};

const getTagRecipes = async (req, res) => {
	const { id: tagId } = req.params;
	const tag = await Tag.findOne({
		_id: tagId,
		createBy: req.user.userId,
	}).populate('recipes');
	if (!tag) throw new NotFoundError(`No tag with tagId ${tagId}`);
	let result = tag.recipes;

	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 10;
	const skip = (page - 1) * limit;
	result = paginate(result, limit, page);

	const recipes = result;

	res.status(StatusCodes.OK).json({ recipes, number: recipes.length });
};

module.exports = {
	getAllTags,
	getTagRecipes,
};

function paginate(array, page_size, page_number) {
	// human-readable page numbers usually start with 1, so we reduce 1 in the first argument
	return array.slice((page_number - 1) * page_size, page_number * page_size);
}
