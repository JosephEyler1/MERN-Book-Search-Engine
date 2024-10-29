import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-express'; // Import Apollo Server's error handling
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

// Define the structure of the JWT payload
interface JwtPayload {
  _id: unknown;
  username: string;
  email: string;
}

// Function to authenticate token in a GraphQL context
export const authenticateToken = (req: Request): JwtPayload => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]; // Extract token after 'Bearer '
    const secretKey = process.env.JWT_SECRET_KEY || ''; // Get secret key from env

    try {
      // Verify the JWT and return the payload
      const user = jwt.verify(token, secretKey) as JwtPayload;
      return user;
    } catch (err) {
      throw new AuthenticationError('Invalid/Expired token'); // Apollo-compatible error
    }
  } else {
    throw new AuthenticationError('Authorization token must be provided'); // Apollo-compatible error
  }
};

// Function to sign a new token
export const signToken = (username: string, email: string, _id: unknown): string => {
  const payload = { username, email, _id }; // Define the JWT payload
  const secretKey = process.env.JWT_SECRET_KEY || ''; // Get secret key from env

  // Sign the token with a 1-hour expiration
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};
