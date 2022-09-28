require('dotenv').config();
require('express-async-errors');

const connectDB = require('../db/connect');
const mongoose = require('mongoose');
const auth = require('../controllers/authController');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const httpMocks = require('node-mocks-http');
const { StatusCodes } = require('http-status-codes');

const {
	BadRequestError,
	NotFoundError,
	UnauthenticatedError,
} = require('../errors');

describe('checkAuth', () => {
	beforeAll(async () => {
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		// just in case test case in database, clean it
		await User.deleteOne({ email: 'validemail@test.com' });
	});

	// use await to make sure it's cleaned up after execution
	afterAll(async () => {
		await User.deleteOne({ email: 'validemail@test.com' });
		await mongoose.connection.close();
	});

	test('Register (Success)', async () => {
		// set up mock req and res
		var req = httpMocks.createRequest({
			body: {
				name: 'validName',
				email: 'validemail@test.com',
				password: 'Pwd123456',
			},
		});
		var res = httpMocks.createResponse();
		await auth.register(req, res);

		// assert if the status code is 201
		expect(res.statusCode).toBe(StatusCodes.CREATED);

		// get data that sent to res
		data = JSON.parse(res._getData());

		//assert the error message is correct
		expect(data.msg).toBe('Registration successful');
	});

	test('Register (Fail) Duplicated email (mongoose.error)', async () => {
		// set up mock req and res
		var req = httpMocks.createRequest({
			body: {
				name: 'validName',
				email: 'validemail@test.com',
				password: 'Pwd123456',
			},
		});
		var res = httpMocks.createResponse();

		await expect(auth.register(req, res)).rejects.toThrow(
			mongoose.Error.MongoServerError
		);
	});

	test('Login (Success)', async () => {
		// set up mock req and res
		var req = httpMocks.createRequest({
			body: { email: 'validemail@test.com', password: 'Pwd123456' },
		});
		var res = httpMocks.createResponse();

		await auth.login(req, res);

		// assert the status code is 200
		expect(res.statusCode).toBe(StatusCodes.OK);

		// get data that sent to res
		data = JSON.parse(res._getData());

		// decode the token to get email
		var emailGet;
		jwt.verify(data.token, process.env.JWT_SECRET, (err, user) => {
			emailGet = user.email;
		});

		// assert if the decoded info is correct
		expect(emailGet).toBe('validemail@test.com');
	});
	test('Login (Fail) Empty email', async () => {
		// set up mock req and res
		var req = httpMocks.createRequest({
			body: { email: '', password: 'Pwd123456' },
		});
		var res = httpMocks.createResponse();

		await expect(auth.login(req, res)).rejects.toThrow(
			new BadRequestError('Please provide email and password')
		);
	});
	test('Login (Fail) Empty password', async () => {
		// set up mock req and res
		var req = httpMocks.createRequest({
			body: { email: 'validemail@test.com', password: '' },
		});
		var res = httpMocks.createResponse();

		await expect(auth.login(req, res)).rejects.toThrow(
			new BadRequestError('Please provide email and password')
		);
	});
	test('Login (Fail) No email', async () => {
		// set up mock req and res
		var req = httpMocks.createRequest({
			body: { email: 'xxxxxxxxx@test.com', password: 'Pwd123456' },
		});
		var res = httpMocks.createResponse();

		await expect(auth.login(req, res)).rejects.toThrow(
			new UnauthenticatedError('Invalid Credentials')
		);
	});

	test('Login (Fail) Wrong password', async () => {
		// set up mock req and res
		var req = httpMocks.createRequest({
			body: { email: 'validemail@test.com', password: 'Pwd12345' },
		});
		var res = httpMocks.createResponse();

		await expect(auth.login(req, res)).rejects.toThrow(
			new UnauthenticatedError('Invalid Credentials')
		);
	});
});
