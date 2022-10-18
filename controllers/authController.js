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
			'https://www.google.com/url?sa=i&url=https%3A%2F%2Fsimply-delicious-food.com%2Feasy-breakfast-board%2F&psig=AOvVaw2ggYpEh3Z0G4ayy6JU41L8&ust=1666186625216000&source=images&cd=vfe&ved=0CAwQjRxqFwoTCOi_oIHz6foCFQAAAAAdAAAAABAE',
	});
	await Category.create({
		name: 'Lunch',
		createBy: user._id,
		picture:
			'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.taste.com.au%2Farticles%2Fadd-gourmet-touch-work-lunch%2Fwnanwsvr&psig=AOvVaw0R9yM01DRW_Ne6zyn5bitn&ust=1666186662886000&source=images&cd=vfe&ved=0CAwQjRxqFwoTCJDAq5Pz6foCFQAAAAAdAAAAABAE',
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
			'https://www.halfbakedharvest.com/wp-content/uploads/2019/04/Ultimate-Spring-Brunch-Board-1-500x500.jpg',
	});
	await Category.create({
		name: 'Dessert',
		createBy: user._id,
		picture:
			'https://myfoodbook.com.au/sites/default/files/collections_image/custard_trifle_summer_dessert.jpeg',
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
