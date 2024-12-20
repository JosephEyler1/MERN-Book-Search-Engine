import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express, { Application, Request, Response} from 'express';
import path from 'node:path';
import db from './config/connection.js';
import { typeDefs } from './schemas/typeDefs.js';
import { resolvers } from './schemas/resolvers.js';
import { authMiddleware } from './services/auth.js'; // Import auth middleware
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
    

const app: Application = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startApolloServer() {
  await server.start();
  await db;
  const __dirname = dirname(fileURLToPath(import.meta.url));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use("/graphql", expressMiddleware(server, {
    context: authMiddleware as any
  }));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, "../../client/dist/index.html"))
    })
  };


  
    app.listen(PORT, () =>
      console.log(
        `🌍 Now listening on http://localhost:${PORT}/graphql`
      )
    );
}

startApolloServer();
