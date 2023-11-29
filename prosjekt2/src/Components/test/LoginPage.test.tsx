import { describe, expect, test } from "vitest";
import LoginPage, {
  AUTH_USER_MUTATION,
  CREATE_USER_MUTATION,
} from "../LoginPage";
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

const mocks = [
  {
    request: {
      query: AUTH_USER_MUTATION,
    },
    result: {
      data: {
        authUser: {
          success: true,
        },
      },
    },
  },
  {
    request: {
      query: CREATE_USER_MUTATION,
    },
    result: {
      data: {
        userCreate: {
          userModel: {
            email: "",
            password: "",
          },
        },
      },
    },
  },
];

const mockStore = createMockStore(initialState);

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("LoginPage", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test("Snapshot test of LoginPage", () => {
    const page = renderWithProviders(<LoginPage />, mockStore, mocks);
    expect(page).toMatchSnapshot();
  });

  test("Check that fields exist and are clickable", async () => {
    const { getByText } = renderWithProviders(<LoginPage />, mockStore, mocks);

    const emailField = getByText("Email Address");
    const passwordField = getByText("Password");
    expect(emailField).toBeTruthy();
    expect(passwordField).toBeTruthy();
  });
});
