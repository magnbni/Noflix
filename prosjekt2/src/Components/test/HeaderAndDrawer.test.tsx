import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store } from "../../../app/store";
import { Provider } from "react-redux";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import HeaderAndDrawer from "../HeaderAndDrawer";
import { userEvent } from "@testing-library/user-event";

describe("HeaderAndDrawer", () => {
  test("Snapshot test of HeaderAndDrawer", () => {
    const client = new ApolloClient({
      uri: "",
      cache: new InMemoryCache(),
    });
    const page = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HeaderAndDrawer />}></Route>
            </Routes>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    );
    expect(page).toMatchSnapshot();
  });

  test("Testing click on searchbar", async () => {
    const client = new ApolloClient({
      uri: "",
      cache: new InMemoryCache(),
    });

    const { getByLabelText } = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HeaderAndDrawer />}></Route>
            </Routes>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    );

    const searchBox = getByLabelText("Search");
    await userEvent.type(searchBox, "test");
    // Should find searchbox
    expect(searchBox).toBeTruthy();
    await userEvent.type(searchBox, "{Enter}");
    // When navigating, we should go to the correct search/:id
    expect(location.pathname).toBe("/search/test");
  });
});
