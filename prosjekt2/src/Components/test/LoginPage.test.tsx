import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import LoginPage from "../LoginPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

describe("LoginPage", () => {
  test("Snapshot test of LoginPage", () => {
    const page = render(<LoginPage></LoginPage>);
    expect(page).toMatchSnapshot();
  });
});
