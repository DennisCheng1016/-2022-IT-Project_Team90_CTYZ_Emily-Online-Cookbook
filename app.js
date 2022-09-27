require('dotenv').config();
require('express-async-errors');

const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_API_KEY,
	api_secret: process.env.CLOUD_API_SECRET,
});
const connectDB = require('./db/connect');
const authenticateUser = require('./middleware/authentication');

// Security

const cors = require('cors');

// Routers
const authRouter = require('./routes/authRoute');
const profileRouter = require('./routes/profileRoute');
const categoryRouter = require('./routes/categoryRoute');
const recipeRouter = require('./routes/recipeRoute');
const tagRouter = require('./routes/tagRoute');

// Error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

const express = require('express');
const app = express();

app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

app.use(cors());

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/profile', authenticateUser, profileRouter);
app.use('/api/v1/category', authenticateUser, categoryRouter);
app.use('/api/v1/recipe', authenticateUser, recipeRouter);
app.use('/api/v1/tag', authenticateUser, tagRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		console.log('Connect Database successfully');
		app.listen(port, () =>
			console.log(`Server is listening on port ${port}...`)
		);
	} catch (error) {
		console.log(error);
	}
};
start();