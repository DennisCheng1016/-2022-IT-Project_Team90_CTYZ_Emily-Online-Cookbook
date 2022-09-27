const express = require('express');
const tagRouter = express.Router();
const { getAllTags, getTagRecipes } = require('../controllers/tagController');
tagRouter.route('/').get(getAllTags);
tagRouter.route('/:id').get(getTagRecipes);

module.exports = tagRouter;
