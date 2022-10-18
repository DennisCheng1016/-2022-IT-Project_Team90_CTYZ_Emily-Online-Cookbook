require('dotenv').config();
require('express-async-errors');
// express
const express = require('express');
const app = express();

// Database
const connectDB = require('./db/connect');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_API_KEY,
	api_secret: process.env.CLOUD_API_SECRET,
});

// Rest of packages
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
// Security
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

// Swagger
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

// Routers
const authRouter = require('./routes/authRoute');
const profileRouter = require('./routes/profileRoute');
const categoryRouter = require('./routes/categoryRoute');
const recipeRouter = require('./routes/recipeRoute');
const tagRouter = require('./routes/tagRoute');
const cartRouter = require('./routes/cartRoute');

// Error handler
const authenticateUser = require('./middleware/authentication');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);
app.use(
	rateLimiter({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100, // limit each IP to 100 requests per windowMs
	})
);

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.use(fileUpload({ useTempFiles: true }));
app.get('/', (req, res) => {
	res.send(
		'<h1>Online Cookbook API</h1><a href="/api-docs">Documentation</a>'
	);
});
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/profile', authenticateUser, profileRouter);
app.use('/api/v1/category', authenticateUser, categoryRouter);
app.use('/api/v1/recipe', authenticateUser, recipeRouter);
app.use('/api/v1/tag', authenticateUser, tagRouter);
app.use('/api/v1/cart', authenticateUser, cartRouter);

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
