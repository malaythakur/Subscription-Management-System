import express from 'express';
import cookieParser from 'cookie-parser';

import { PORT } from './config/env.js';

import userRouter  from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';
import workflowRouter from './routes/workflow.routes.js';

const app = express();

app.use(express.json()); // Reads raw JSON from request -> Converts it to JavaScript object -> Attaches it to req.body
app.use(express.urlencoded({extended: false})); // Only matters for HTML form submissions -> Converts form data into req.body
app.use(cookieParser()); // Reads cookie header -> Converts it to object -> Attaches to req.cookies
app.use(arcjetMiddleware);
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows',workflowRouter);
app.use(errorMiddleware);

app.get('/', (req,res)=>{
    res.send("Welcome to the subscription Tracker API!");
});

app.listen(PORT,async ()=>{
    console.log(`Subscription Tracker API is running on http://localhost:${PORT}`);

    await connectToDatabase();
});

export default app; 

