import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { store } from "../../../app/store";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import UserPage from "../UserPage";

describe("UserPage", () => {
  test("Snapshot test of UserPage", () => {
    const client = new ApolloClient({
      uri: "",
      cache: new InMemoryCache(),
    });
    const page = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<UserPage />}></Route>
            </Routes>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    );
    expect(page).toMatchSnapshot();
  });
});
