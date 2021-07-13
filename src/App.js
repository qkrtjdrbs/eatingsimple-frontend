import { ApolloProvider } from "@apollo/client";
import { client } from "./apollo";
import { HelmetProvider } from "react-helmet-async";
import { GlobalStyles } from "./styles";
import MainRouter from "./Routers";

function App() {
  return (
    <ApolloProvider client={client}>
      <GlobalStyles />
      <HelmetProvider>
        <MainRouter />
      </HelmetProvider>
    </ApolloProvider>
  );
}

export default App;
