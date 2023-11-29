import { fireEvent } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { MovieType } from "../../types";
import NestedModal from "../NestedModal";
import { createMockStore, renderWithProviders } from "./utils";
import { MockedResponse } from "@apollo/client/testing";

const initialState = {
  sort: {
    sortBy: "",
    sortOrder: "asc",
    filterYear: [1900, 2025],
    filterByGenre: "",
  },
  user: {
    authUser: false,
    email: "",
  },
};

const mocks: MockedResponse<Record<string, any>, Record<string, any>>[] = [
];

const mockStore = createMockStore(initialState);

describe("NestedModal", () => {
  test("Snapshot test of NestedModal", () => {
    const movie: MovieType = {
      Id: "MOCK",
      title: "MOCK",
      releaseDate: "MOCK",
      overview: "MOCK",
      voteAverage: 0,
      posterPath: "MOCK",
    };
    
    const page = renderWithProviders(
          <NestedModal movie={movie}></NestedModal>, mockStore, mocks
    );
    expect(page).toMatchSnapshot();
  });

  it('opens and closes the modal on click', async () => {
    const movie = {
      Id: "1",
      title: "MOCK",
      releaseDate: "MOCK",
      overview: "MOCK",
      voteAverage: 0,
      posterPath: "MOCK",
    };

    const { getByTestId } = renderWithProviders(
      <NestedModal movie={movie}></NestedModal>, mockStore, mocks
    );

    fireEvent.click(getByTestId('ActionAreaCard'));
    expect(getByTestId('modal')).toBeTruthy();

    fireEvent.click(getByTestId('close'));
    expect(() => getByTestId('modal')).toThrowError();
  });

  it('displays movie information correctly', () => {
    const movie = {
      Id: '1',
      title: 'Test Movie',
      posterPath: '/testpath.jpg',
      releaseDate: '2022-01-01',
      voteAverage: 8,
      overview: 'Test overview',
    };
  
    const { getByTestId, getByText } = renderWithProviders(
      <NestedModal movie={movie}></NestedModal>, mockStore, mocks
    );
  
    fireEvent.click(getByTestId('ActionAreaCard'));
  
    expect(getByText(movie.releaseDate)).toBeTruthy();
    expect(getByText(movie.overview)).toBeTruthy();
  });
});
