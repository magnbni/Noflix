import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { Provider } from "react-redux";
import { store } from "../app/store";

// Setting the GraphQL endpoint URI based on the environment
let uri = "http://it2810-14.idi.ntnu.no:4000/graphql";

// If in development mode, use the local server
if (import.meta.env.MODE === "development") {
  uri = "http://localhost:4000/graphql";
}

// Creating an Apollo Client instance with the specified URI and cache
const client = new ApolloClient({
  uri: uri,
  cache: new InMemoryCache(),
});

// Rendering the root component into the DOM
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename="/project2">
      <ApolloProvider client={client}>
        <Provider store={store}>
          <App />
        </Provider>
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
