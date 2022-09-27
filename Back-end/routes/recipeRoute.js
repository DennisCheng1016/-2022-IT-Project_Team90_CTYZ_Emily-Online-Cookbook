const express = require('express');
const recipeRouter = express.Router();
const {
	getRecipes,
	createRecipe,
	updateRecipe,
	deleteRecipe,
	completeRecipe,
	favoriteRecipe,
} = require('../controllers/recipeController');
const {
	uploadImage,
	deleteImage,
} = require('../controllers/imageUploadController');

recipeRouter.route('/').get(getRecipes).post(createRecipe);
recipeRouter.route('/:id').patch(updateRecipe).delete(deleteRecipe);
recipeRouter.route('/complete/:id').patch(completeRecipe);
recipeRouter.route('/favorite/:id').patch(favoriteRecipe);
recipeRouter.route('/image').post(uploadImage).delete(deleteImage);
recipeRouter.route('/image/:id').delete(deleteImage);

module.exports = recipeRouter;
