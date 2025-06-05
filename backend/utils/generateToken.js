import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const generateToken = (userId) => {
    dotenv.config();
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    const token = jwt.sign({ id: userId }, jwtSecret, {
        expiresIn: '14d',
    })
    return token;
}

export default generateToken;