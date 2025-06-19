import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createProxyMiddleware } from 'http-proxy-middleware';
import authRouter from './routes/authRouter.js';
import flashcardRouter from './routes/flashcardRouter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const corsOptions = {
    origin: true,
    credentials: true,
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/flashcards', flashcardRouter);

// Frontend
app.use('/', createProxyMiddleware({
    target: 'http://localhost:5173',
    changeOrigin: true,
}))

mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.log(error);
});