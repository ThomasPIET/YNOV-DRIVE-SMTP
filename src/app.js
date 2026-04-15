import express from 'express';
import cors from 'cors';
import emailRoutes from './routes/email.route.js';

import { errorHandler } from './middleware/error.middleware.js';

export const App = () => {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use('/api/email', emailRoutes);

    app.use(errorHandler);

    return app;
}