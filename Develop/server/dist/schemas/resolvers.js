import { AuthenticationError } from 'apollo-server-express';
import { signToken } from '../services/auth.js'; // Adjusted path
import User from '../models/User.js';
export const resolvers = {
    Query: {
        me: async (_, __, { user }) => {
            if (!user) {
                throw new AuthenticationError('You must be logged in');
            }
            return await User.findById(user._id).exec(); // Use exec() for better performance
        },
    },
    Mutation: {
        login: async (_, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user || !(await user.isCorrectPassword(password))) {
                throw new AuthenticationError('Invalid credentials');
            }
            const token = signToken(user.username, user.email, user.id);
            return { token, user };
        },
        addUser: async (_, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user.username, user.email, user.id);
            return { token, user };
        },
        saveBook: async (_, { input }, { user }) => {
            console.log(user);
            if (!user) {
                throw new AuthenticationError('You must be logged in');
            }
            return await User.findByIdAndUpdate(user._id, { $addToSet: { savedBooks: input } }, { new: true }).exec(); // Use exec() for better performance
        },
        removeBook: async (_, { bookId }, { user }) => {
            if (!user) {
                throw new AuthenticationError('You must be logged in');
            }
            return await User.findByIdAndUpdate(user._id, { $pull: { savedBooks: { bookId } } }, { new: true }).exec(); // Use exec() for better performance
        },
    },
};
