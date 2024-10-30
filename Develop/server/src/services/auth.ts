import type { Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

interface DecodedUser extends JwtPayload {
  _id: string;
  username: string;
  email: string;
}

// GraphQL-compatible authentication middleware
export const authMiddleware = ({ req }: { req: Request }): DecodedUser | null => {
  const authHeader = req.headers.authorization;
  const secretKey = process.env.JWT_SECRET_KEY || '';

  if (!authHeader) {
    console.warn('No token provided');
    return null; // No token, return null to indicate unauthenticated user
  }

  const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

  try {
    const decoded = jwt.verify(token, secretKey) as DecodedUser;
    return decoded; // Return decoded user object
  } catch (error) {
    console.error('Invalid or expired token:', error);
    return null; // Return null if token is invalid
  }
};

// Function to sign JWT tokens
export const signToken = (username: string, email: string, _id: string): string => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '1h' }); // 1 hour expiry
};
