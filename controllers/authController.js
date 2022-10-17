const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const Category = require('../models/Category');

const register = async (req, res) => {
	const user = await User.create(req.body);
	const token = user.createJWT();
	await Category.create({ name: 'Breakfast', createBy: user._id });
	await Category.create({ name: 'Lunch', createBy: user._id });
	await Category.create({ name: 'Dinner', createBy: user._id });
	await Category.create({ name: 'Snack', createBy: user._id });
	await Category.create({ name: 'Brunch', createBy: user._id });
	await Category.create({ name: 'Dessert', createBy: user._id });
	res.status(StatusCodes.CREATED).json({
		user: { name: user.name },
		token,
		msg: 'Registration successful',
	});
};

const login = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		throw new BadRequestError('Please provide email and password');
	}
	let user = await User.findOne({ email });
	if (!user) {
		throw new UnauthenticatedError('Invalid Credentials');
	}
	const isPasswordCorrect = await user.comparePassword(password);
	if (!isPasswordCorrect) {
		throw new UnauthenticatedError('Invalid Credentials');
	}
	// compare password
	const token = user.createJWT();
	user.password = undefined;
	res.status(StatusCodes.OK).json({ user, token });
};

module.exports = {
	register,
	login,
};
