import { EnhancedStore, configureStore } from "@reduxjs/toolkit";
import sortReducer, { SortState } from "../../Reducers/SortSlice";
import userReducer, { UserState } from "../../Reducers/UserSlice";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";

export type AppState = {
  sort: SortState;
  user: UserState;
};

export function createMockStore(initialState: AppState) {
  return configureStore({
    reducer: {
      sort: sortReducer,
      user: userReducer,
    },
    preloadedState: initialState,
  });
}

export const renderWithProviders = (
  component: JSX.Element,
  mockStore: EnhancedStore,
  mocks: MockedResponse[],
) => {
  // Create a mock store with initial state
  return render(
    <Provider store={mockStore}>
      <BrowserRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          {component}
        </MockedProvider>
      </BrowserRouter>
    </Provider>,
  );
};
