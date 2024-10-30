import express from 'express';
import path from 'node:path';
import { ApolloServer } from 'apollo-server-express';
import db from './config/connection.js';
import routes from './routes/index.js';
import { typeDefs } from './schemas/typeDefs.js';
import { resolvers } from './schemas/resolvers.js';
import { authMiddleware } from './services/auth.js'; // Updated import path
const app = express();
const PORT = process.env.PORT || 3001;
async function startApolloServer() {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => {
            const user = authMiddleware({ req }); // Attach the user to the context
            return { user };
        },
    });
    await server.start();
    server.applyMiddleware({ app });
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    if (process.env.NODE_ENV === 'production') {
        app.use(express.static(path.join(__dirname, '../client/build')));
    }
    app.use(routes);
    db.once('open', () => {
        app.listen(PORT, () => console.log(`🌍 Now listening on http://localhost:${PORT}${server.graphqlPath}`));
    });
}
startApolloServer();
