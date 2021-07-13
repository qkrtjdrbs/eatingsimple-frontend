import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const TOKEN = "token";

export const isLoggedInVar = makeVar(Boolean(localStorage.getItem(TOKEN)));
export const logUserIn = (token) => {
  localStorage.setItem(TOKEN, token);
  isLoggedInVar(true);
};
export const logUserOut = (history) => {
  localStorage.removeItem(TOKEN);
  //kill all previous states
  if (history) {
    history.replace();
  }
  window.location.reload();
};

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});
//send token to http headers
const authLink = setContext((_, { headers }) => {
  return {
    //new headers
    headers: {
      ...headers, //previous headers
      token: localStorage.getItem(TOKEN), // plus token
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    //The way of saving on cache.
    typePolicies: {
      User: {
        keyFields: (obj) => `User:${obj.userName}`,
      },
    },
  }),
});
