import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createProxyMiddleware } from 'http-proxy-middleware';
import authRouter from './routes/authRouter.js';
import flashcardRouter from './routes/flashcardRouter.js';
import learnRouter from './routes/learnRouter.js';
import matchRouter from './routes/matchRouter.js';
import classRouter from './routes/classRouter.js';

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
app.use('/api/learn', learnRouter);
app.use('/api/match', matchRouter);
app.use('/api/classes', classRouter);

// Frontend
app.use((req, res) => {
    res.sendFile('./public/index.html', { root: '.' }, (error) => {
        if (error) {
            console.error('Error sending index file:', error);
            res.status(500).send('Page not found');
        }
    })
})

mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log('MongoDB connected');
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((error) => {
    console.log(error);
});