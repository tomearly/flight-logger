import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { App } from "./App";

function createStorageStub(): Storage {
  const storage = new Map<string, string>();

  return {
    get length() {
      return storage.size;
    },
    clear: () => {
      storage.clear();
    },
    getItem: (key: string) => storage.get(key) ?? null,
    key: (index: number) => Array.from(storage.keys())[index] ?? null,
    removeItem: (key: string) => {
      storage.delete(key);
    },
    setItem: (key: string, value: string) => {
      storage.set(key, value);
    }
  };
}

describe("App", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the flight logger dashboard", async () => {
    vi.stubGlobal("localStorage", createStorageStub());

    render(<App />);

    expect(screen.getByRole("heading", { name: "Ready for takeoff" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log hours" })).toBeInTheDocument();
    expect(screen.getByText("Log your first flight")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("Loading saved flights...")).not.toBeInTheDocument();
    });
  });
});
