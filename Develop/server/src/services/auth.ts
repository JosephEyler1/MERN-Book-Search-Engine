import type { Request} from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

interface DecodedUser extends JwtPayload {
  _id: string;
  username: string;
  email: string;
}

// GraphQL-compatible authentication function
export const authMiddleware = ({ req }: { req: Request }): DecodedUser | null => {
  const authHeader = req.headers.authorization;
  const secretKey = process.env.JWT_SECRET_KEY || '';

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, secretKey) as DecodedUser;
      return decoded; // Return the decoded user object for use in context
    } catch (err) {
      console.warn('Invalid token');
      return null; // Invalid token, return null
    }
  }

  console.warn('No token provided');
  return null; // No token provided, return null
};

// Function to sign JWT tokens
export const signToken = (username: string, email: string, _id: string) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};
