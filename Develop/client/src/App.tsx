import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { setContext } from '@apollo/client/link/context';

const link = createHttpLink({
  uri: "/graphql"
})
const authLink = setContext((_, {headers}) => {
  const token = localStorage.getItem("id_token")
  return{
    headers: { 
      ... headers,
      authorization: token ?? " "
    }
  }
})
const client = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
        <Navbar />
        <Outlet />
    </ApolloProvider>
  );
}

export default App;
