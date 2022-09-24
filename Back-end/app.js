require('dotenv').config();
require('express-async-errors')
const express = require('express');
const app = express();

const connectDB = require('./db/connect')
const authticateUser = require('./middleware/authentication')
// Routers
const authRouter = require('./routes/authRoute')

// Error handler
const NotFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.use(express.json())

// Routes
app.use('/api/v1/auth', authRouter);

app.use(NotFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        console.log("Connect Database successfully")
        app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`)
        );
    } catch (error) {
        console.log(error);
    }};
start();