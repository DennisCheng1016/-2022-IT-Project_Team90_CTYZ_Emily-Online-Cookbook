const path = require('path');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError } = require('../errors');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const uploadImage = async (req, res) => {
	const result = await cloudinary.uploader.upload(
		req.files.image.tempFilePath,
		{
			// use_filename: true,
			folder: 'Cookbook',
		}
	);
	fs.unlinkSync(req.files.image.tempFilePath);
	return res.status(StatusCodes.OK).json({
		image: {
			src: result.secure_url,
			imageId: result.public_id.split('/')[1],
		},
	});
};

const deleteImage = async (req, res) => {
	const deleteId = 'Cookbook/' + req.params.id;
	const result = await cloudinary.uploader.destroy(
		'Cookbook/' + req.params.id
	);
	if (!result) {
		throw new NotFoundError(`No image with id ${req.params}`);
	}
	res.status(StatusCodes.OK).send();
};

module.exports = {
	uploadImage,
	deleteImage,
};
