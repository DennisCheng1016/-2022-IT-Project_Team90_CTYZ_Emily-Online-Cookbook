const express = require('express');
const categoryRouter = express.Router();
const {
	getCategories,
	createCategory,
	updateCategory,
	deleteCategory,
} = require('../controllers/categoryController');

categoryRouter.route('/').get(getCategories).post(createCategory);
categoryRouter.route('/:id').patch(updateCategory).delete(deleteCategory);

module.exports = categoryRouter;
