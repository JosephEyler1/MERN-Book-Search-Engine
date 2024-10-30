import { AuthenticationError } from 'apollo-server-express';

import { signToken } from '../services/auth'; // Adjusted path
import User from '../models/User';

interface Context {
  user?: { _id: string; username: string; email: string }; // Define the user type based on your JWT payload
}

interface LoginInput {
  email: string;
  password: string;
}

interface AddUserInput {
  username: string;
  email: string;
  password: string;
}

interface SaveBookInput {
  input: any; // You might want to define a specific type for your book input
}

interface RemoveBookInput {
  bookId: string;
}

export const resolvers = {
  Query: {
    me: async (_: unknown, __: unknown, { user }: Context) => {
      if (!user) {
        throw new AuthenticationError('You must be logged in');
      }
      return await User.findById(user._id).exec(); // Use exec() for better performance
    },
  },
  Mutation: {
    login: async (_: unknown, { email, password }: LoginInput) => {
      const user = await User.findOne({ email });

      if (!user || !(await user.isCorrectPassword(password))) {
        throw new AuthenticationError('Invalid credentials');
      }

      const token = signToken(user.username, user.email, user.id);
      return { token, user };
    },
    addUser: async (_: unknown, { username, email, password }: AddUserInput) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user.username, user.email, user.id);
      return { token, user };
    },
    saveBook: async (_: unknown, { input }: SaveBookInput, { user }: Context) => {
      if (!user) {
        throw new AuthenticationError('You must be logged in');
      }
      return await User.findByIdAndUpdate(
        user._id,
        { $addToSet: { savedBooks: input } },
        { new: true }
      ).exec(); // Use exec() for better performance
    },
    removeBook: async (_: unknown, { bookId }: RemoveBookInput, { user }: Context) => {
      if (!user) {
        throw new AuthenticationError('You must be logged in');
      }
      return await User.findByIdAndUpdate(
        user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      ).exec(); // Use exec() for better performance
    },
  },
};
