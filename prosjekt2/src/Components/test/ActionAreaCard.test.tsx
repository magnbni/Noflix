import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, test } from "vitest";
import ActionAreaCard, { ActionAreaCardProps } from "../ActionAreaCard";
import { MovieType } from "../../types";

describe("ActionAreaCard", () => {
  const mockMovie: MovieType = {
    title: "Example Movie Title",
    releaseDate: "2023-01-01",
    posterPath: "/example.jpg",
    voteAverage: 8,
    Id: "",
    overview: "Example overview",
  };

  test("Snapshot test of page", () => {
    const page = render(<ActionAreaCard movie={mockMovie} />);
    expect(page).toMatchSnapshot();
  });

  it("renders correctly with a movie", () => {
    const { getByText, getByTestId } = render(
      <ActionAreaCard movie={mockMovie} />,
    );
    expect(getByText("Example Movie Title")).toBeInTheDocument();

    // Check for the date
    const formattedDate = new Date(mockMovie.releaseDate).toLocaleDateString(
      "en-GB",
    );
    expect(getByText(formattedDate)).toBeInTheDocument();

    // Check for the image
    const image = getByTestId("movie-poster"); // Make sure to add 'data-testid="movie-poster"' to your image component
    expect(image).toHaveStyle(
      `backgroundImage: url(https://image.tmdb.org/t/p/original//${mockMovie.posterPath})`,
    );
  });

  it("handles long titles correctly", () => {
    const longTitleMovie = {
      ...mockMovie,
      title: "This is a very long movie title that should be truncated",
    };
    const { getByText } = render(<ActionAreaCard movie={longTitleMovie} />);
    expect(getByText("This is a very long...")).toBeInTheDocument();
  });

  it("renders correctly without a movie", () => {
    const actionAreaCardProps: ActionAreaCardProps = {
      movie: undefined,
    };
    const { getByTestId } = render(<ActionAreaCard {...actionAreaCardProps} />);
    expect(getByTestId("skeleton-loader")).toBeTruthy();
  });
});
