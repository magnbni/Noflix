import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ReadOnlyRating } from "../BasicRating";

describe("BasicRating Snapshot", () => {
  test("Snapshot test of read only rating", () => {
    const page = render(ReadOnlyRating(0));
    expect(page).toMatchSnapshot();
  });
});
