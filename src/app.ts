import express, { Express } from 'express';
import cors from 'cors';
import { morganMiddleware } from './config/morgan';
import { apiRoutes } from './api';
import { errorHandler } from './middleware/error.middleware';
import { Server } from 'http';

const app: Express = express();

// Basic CORS setup
// const corsOptions = {
//   origin: true, // or specify domains: ['http://example.com']
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// };

app.use(express.json({ limit: '50mb' })); // Middleware to parse JSON bodies
app.use(cors());
// app.options('*', cors());     // have issue so need to see documentation

app.use(morganMiddleware);

// Routes
app.use('/api', apiRoutes);

// Error handling middleware (should be last)
app.use(errorHandler);

const startApp = (port: number): Server => {
    const server = app.listen(port, () => {
        console.log(`Express is listening at ${port}`);
    });
    return server;
};

export { app, startApp };