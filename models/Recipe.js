const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, 'Please provide title'],
			maxlength: 50,
			trim: true,
		},
		introduction: {
			type: String,
			trim: true,
		},
		ingredients: [
			{
				type: String,
				trim: true,
			},
		],
		methods: [
			{
				type: String,
				trim: true,
			},
		],
		picture: {
			type: String,
			default:
				'https://res.cloudinary.com/dszr2oqub/image/upload/v1666274090/Cookbook/%E6%88%AA%E5%9C%96_2022-10-21_00.54.13_urrevo.png',
		},
		imageId: {
			type: String,
		},
		cookTime: {
			type: Number,
		},
		serve: {
			type: Number,
		},
		completed: {
			type: Date,
		},
		favorite: {
			type: Boolean,
			default: false,
		},
		tags: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Tag',
			},
		],
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category',
			required: [true, 'Please provide category'],
		},
		createBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'Please provide user'],
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Recipe', RecipeSchema);
