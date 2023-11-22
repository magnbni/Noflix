import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import ActionAreaCard from "../ActionAreaCard";
import { MovieType } from "../../types";

describe("ActionAreaCard", () => {
  test("Snapshot test of page", () => {
    const movie: MovieType = {
      Id: "MOCK",
      title: "MOCK",
      releaseDate: "MOCK",
      overview: "MOCK",
      voteAverage: 0,
      posterPath: "MOCK",
    };
    const page = render(<ActionAreaCard {...movie} />);
    expect(page).toMatchSnapshot();
  });
});
