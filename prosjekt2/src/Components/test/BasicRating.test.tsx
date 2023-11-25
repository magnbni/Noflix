import { fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Rate, ReadOnlyRating, GET_USER_RATING, DELETE_USER_RATING } from "../BasicRating";
import { Provider } from "react-redux";
import { store } from "../../../app/store";
import { MockedProvider } from "@apollo/client/testing";
import '@testing-library/jest-dom';

const rateProps = {
  initValue: 0,
  movieId: '123',
  handleUserRating: vi.fn(),
  open: true,
};

const userEmailState = '';

const mocks = [
  {
    request: {
      query: GET_USER_RATING,
      variables: { userEmail: userEmailState, movieId: rateProps.movieId },
    },
    result: {
      data: {
        userMovieRating: {
          ratingValue: 3,
        },
      },
    },
  },
  {
    request: {
      query: DELETE_USER_RATING,
      variables: { userEmail: userEmailState, movieId: rateProps.movieId },
    },
    result: {
      data: {
        deleteUserRatings: {
          success: true,
        },
      },
    },
  },
  // ... any other mocks ...
];

describe("BasicRating Snapshot", () => {
  test("Snapshot test of read only rating", () => {
    const page = render(ReadOnlyRating(0));
    expect(page).toMatchSnapshot();
  });
  
  it('renders correctly', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Rate {...rateProps} />
        </MockedProvider>
      </Provider>
    );

    const rating = getByTestId("simple-controlled");
    expect(rating).toBeInTheDocument();
  });

  it('Updates rating on click', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Rate {...rateProps} />
        </MockedProvider>
      </Provider>
    );

    const rating = getByTestId("simple-controlled");

    // Click on one of the elements inside rating
    const star = rating?.querySelector('span[role="radio"]');

    if (star) {
      fireEvent.click(star);

      await waitFor(() => {
        expect(rateProps.handleUserRating).toHaveBeenCalled();
        expect(rating).toHaveValue(3);
      });
    }
  });

  it ('Deletes rating on click', async () => {
    const { getByTestId, queryByTestId } = render(
      <Provider store={store}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Rate {...rateProps} />
        </MockedProvider>
      </Provider>
    );

    const rating = getByTestId("simple-controlled");

    // Click on one of the elements inside rating
    const star = rating?.querySelector('span[role="radio"]');

    if (star) {
      fireEvent.click(star);

      await waitFor(() => {
        expect(rateProps.handleUserRating).toHaveBeenCalled();
        expect(rating).toHaveValue(3);
      });
    }

    const deleteButton = queryByTestId("delete");
    
    if (deleteButton) {
      fireEvent.click(deleteButton);
  
      await waitFor(() => {
        expect(rating).toHaveValue(0);
      });
    }
  });
});
