import { fireEvent } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import FilterAndSort, { GENRES_QUERY } from "../FilterAndSort";
import "@testing-library/jest-dom";
import { AppState, createMockStore, renderWithProviders } from "./utils";

const initialState: AppState = {
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

let mockStore = createMockStore(initialState);

// Mock data for your GraphQL query
const mocks = [
  {
    request: {
      query: GENRES_QUERY,
    },
    result: {
      data: {
        allGenres: {
          edges: [
            {
              node: {
                name: "Action",
                id: "1",
              },
            },
            {
              node: {
                name: "Adventure",
                id: "2",
              },
            },
            {
              node: {
                name: "Animation",
                id: "3",
              },
            },
          ],
        },
      },
    },
  },
];

describe("FilterAndSort", () => {
  beforeAll(() => {
    mockStore = createMockStore(initialState);
  });

  test("Snapshot test of FilterAndSort", () => {
    const page = renderWithProviders(<FilterAndSort />, mockStore, mocks);
    expect(page).toMatchSnapshot();
  });

  it("renders correctly", () => {
    renderWithProviders(<FilterAndSort />, mockStore, mocks);
  });

  it("toggles sort order when the switch is clicked", () => {
    const { getByTestId } = renderWithProviders(
      <FilterAndSort />,
      mockStore,
      mocks,
    );

    const sortOrderSwitch = getByTestId("sortorder");
    fireEvent.click(sortOrderSwitch);

    const state = mockStore.getState();
    expect(state.sort.sortOrder).toEqual("desc");
  });
});
