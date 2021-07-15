import { ApolloProvider } from "@apollo/client";
import { client } from "./apollo";
import { HelmetProvider } from "react-helmet-async";
import { GlobalStyles, theme } from "./styles";
import MainRouter from "./Routers";
import { ThemeProvider } from "styled-components";

function App() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <HelmetProvider>
          <MainRouter />
        </HelmetProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
