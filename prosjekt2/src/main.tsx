import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { Provider } from "react-redux";
import { store } from "../app/store";

const client = new ApolloClient({
  // uri: "http://it2810-14.idi.ntnu.no:4000/graphql", // For deployment
  uri: "http://localhost:4000/graphql", // For local development
  cache: new InMemoryCache(),
});

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
