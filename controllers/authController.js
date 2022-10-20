const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const Category = require('../models/Category');

const register = async (req, res) => {
	const user = await User.create(req.body);
	const token = user.createJWT();
	await Category.create({
		name: 'Breakfast',
		createBy: user._id,
		picture:
			'https://img.delicious.com.au/zwzzSNao/del/2018/08/chilli-labneh-eggs-87071-2.jpg',
	});
	await Category.create({
		name: 'Lunch',
		createBy: user._id,
		picture:
			'https://img.taste.com.au/sv9d9AM6/w720-h480-cfill-q80/taste/2016/11/pork-and-bean-burrito-bowl-109208-1.jpeg',
	});
	await Category.create({
		name: 'Dinner',
		createBy: user._id,
		picture:
			'https://img.taste.com.au/jiSV54sY/taste/2015/05/baked-chicken-with-pumpkin-and-chorizo-taste-152086-2.jpg',
	});
	await Category.create({
		name: 'Snack',
		createBy: user._id,
		picture:
			'https://assets.bonappetit.com/photos/61b7c725ae5736f3022cb4fb/5:4/w_3991,h_3193,c_limit/20211207%20ITS%20Snack%20Mix%20Lede.jpg',
	});
	await Category.create({
		name: 'Brunch',
		createBy: user._id,
		picture:
			'https://static01.nyt.com/images/2018/07/25/dining/25australian-6/25australian-6-jumbo.jpg',
	});
	await Category.create({
		name: 'Dessert',
		createBy: user._id,
		picture:
			'https://static01.nyt.com/images/2022/02/12/dining/JT-Chocolate-Chip-Cookies/JT-Chocolate-Chip-Cookies-blog480.jpg',
	});
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
