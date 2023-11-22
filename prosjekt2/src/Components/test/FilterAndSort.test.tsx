import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import FilterAndSort from "../FilterAndSort";
import { store } from "../../../app/store";
import { Provider } from "react-redux";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

describe("FilterAndSort", () => {
  test("Snapshot test of FilterAndSort", () => {
    const client = new ApolloClient({
      uri: "",
      cache: new InMemoryCache(),
    });
    const page = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <FilterAndSort />
        </Provider>
      </ApolloProvider>,
    );
    expect(page).toMatchSnapshot();
  });
});
