import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes'
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';

const app = express();
const MONGO_URI = 'mongodb://localhost:27017/test';

mongoose.connect(MONGO_URI)
    .then(() => {
            console.log(`Database Connected Successfully!`);
    })
    .catch(error => {
        console.error('MongoDB connection error:', error);
    });

// Apply rate limiter middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.'
});
app.use(limiter);
app.use(bodyParser.json());

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post',postRoutes);
app.use('/api/comments', commentRoutes);

//start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});