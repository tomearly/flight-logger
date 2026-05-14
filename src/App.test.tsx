import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { App } from "./App";

describe("App", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the flight logger dashboard", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve([]),
          ok: true
        })
      )
    );

    render(<App />);

    expect(screen.getByRole("heading", { name: "Ready for takeoff" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log hours" })).toBeInTheDocument();
    expect(screen.getByText("Log your first flight")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("Loading saved flights...")).not.toBeInTheDocument();
    });
  });
});
