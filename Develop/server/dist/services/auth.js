import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables
// GraphQL-compatible authentication middleware
export const authMiddleware = ({ req }) => {
    let token = req.body.token || req.query.token || req.headers.authorization;
    const secretKey = process.env.JWT_SECRET_KEY || '';
    if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1]; // Extract token from "Bearer <token>"
    }
    if (!token) {
        console.log("no token provided");
        return req;
    }
    try {
        const { data } = jwt.verify(token, secretKey);
        req.user = data; // Return decoded user object
    }
    catch (error) {
        console.error('Invalid or expired token:', error);
        return req; // Return req if token is invalid
    }
    return req;
};
// Function to sign JWT tokens
export const signToken = (username, email, _id) => {
    const payload = { username, email, _id };
    const secretKey = process.env.JWT_SECRET_KEY || '';
    return jwt.sign({ data: payload }, secretKey, { expiresIn: '1h' }); // 1 hour expiry
};
