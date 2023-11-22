import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { store } from "../../../app/store";
import { Provider } from "react-redux";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { MovieType } from "../../types";
import NestedModal from "../NestedModal";

describe("NestedModal", () => {
  test("Snapshot test of NestedModal", () => {
    const client = new ApolloClient({
      uri: "",
      cache: new InMemoryCache(),
    });
    const movie: MovieType = {
      Id: "MOCK",
      title: "MOCK",
      releaseDate: "MOCK",
      overview: "MOCK",
      voteAverage: 0,
      posterPath: "MOCK",
    };
    const page = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <NestedModal movie={movie}></NestedModal>
        </Provider>
      </ApolloProvider>,
    );
    expect(page).toMatchSnapshot();
  });
});
