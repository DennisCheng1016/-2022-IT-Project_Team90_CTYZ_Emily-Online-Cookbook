const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const updateName = async (req, res) => {
	const {
		body: { name },
		params: { id: userId },
	} = req;
	if (name === '') throw new BadRequestError('Name cannot be empty');
	const user = await User.findOneAndUpdate({ _id: userId }, req.body, {
		new: true,
		runValidators: true,
	}).select('-password');
	if (!user) throw new NotFoundError(`No user with id ${userId}`);
	res.status(StatusCodes.OK).json({ user });
};
module.exports = {
	updateName,
};
