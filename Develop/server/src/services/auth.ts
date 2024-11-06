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
export const authMiddleware = ({ req }: { req: Request })=> {
  let token = req.body.token || req.query.token || req.headers.authorization;
  const secretKey = process.env.JWT_SECRET_KEY || '';

  if (req.headers.authorization) {
     token = req.headers.authorization.split(' ')[1]; // Extract token from "Bearer <token>"
  }

  if (!token){
    console.log("no token provided")
    return req;
  }

  try {
    const { data } = jwt.verify(token, secretKey) as DecodedUser;
    req.user= data; // Return decoded user object
  } catch (error) {
    console.error('Invalid or expired token:', error);
    return req; // Return req if token is invalid
  }
  return req;
};

// Function to sign JWT tokens
export const signToken = (username: string, email: string, _id: string): string => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign({data:payload}, secretKey, { expiresIn: '1h' }); // 1 hour expiry
};
