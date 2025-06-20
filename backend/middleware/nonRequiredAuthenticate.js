import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const nonRequiredAuthenticate = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return next();
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return next();
        }
        req.user = user;
        next();
    } catch (error) {
        return next();
    }
}

export default nonRequiredAuthenticate;