import express from 'express';
import cors from 'cors';

// Route files
import authRoutes from './routes/authRoutes.js';
import domainRoutes from './routes/domainRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js';
import progressRoutes from './routes/progressRoutes.js';


const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/domains', domainRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/progress', progressRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'DPR Backend API is running' });
});

export default app;
