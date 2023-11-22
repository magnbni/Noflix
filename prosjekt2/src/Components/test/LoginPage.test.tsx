import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import LoginPage from "../LoginPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store } from "../../../app/store";
import { Provider } from "react-redux";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

describe("LoginPage", () => {
  test("Snapshot test of LoginPage", () => {
    const client = new ApolloClient({
      uri: "",
      cache: new InMemoryCache(),
    });
    const page = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LoginPage />}></Route>
            </Routes>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );
    expect(page).toMatchSnapshot();
  });

  test("Check that fields exist and are clickable", async () => {
    const client = new ApolloClient({
      uri: "",
      cache: new InMemoryCache(),
    });
    const { getByText } = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LoginPage />}></Route>
            </Routes>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    const emailField = getByText("Email Address");
    const passwordField = getByText("Password");
    expect(emailField).toBeTruthy();
    expect(passwordField).toBeTruthy();
  });
});
