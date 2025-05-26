import express from 'express';
import itemRoutes from './routes/itemRoutes';
import authRoutes from './routes/authRoutes';
import electionRoutes from './routes/electionRoutes'
import votersRoutes from './routes/voterRoutes'
import morgan from 'morgan';
import { errorHandler } from './middlewares/errorHandler';

import cors from 'cors';

const app = express();

app.use(cors({
    origin: '*',
}))

app.use(express.json());

// Logging middleware
app.use(morgan('combined'));

// Routes
app.use('/api/items', itemRoutes);

// Added auth routes
app.use('/api/auth', authRoutes);

app.use('/api/elections', electionRoutes);

app.use('/api/voters', votersRoutes)

// Global error handler (should be after routes)
app.use(errorHandler);



export default app;


