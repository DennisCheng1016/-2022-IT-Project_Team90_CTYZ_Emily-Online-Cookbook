require('dotenv').config();
require('express-async-errors')
const express = require('express');
const app = express();

const connectDB = require('./db/connect')
const authenticateUser = require('./middleware/authentication')
// Routers
const authRouter = require('./routes/authRoute')
const profileRouter = require('./routes/profileRoute')

// Error handler
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.use(express.json())

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/profile', authenticateUser , profileRouter)

app.use(notFoundMiddleware)
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