import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HeaderActions } from "./header-actions";

const mocks = vi.hoisted(() => ({
  setTheme: vi.fn(),
  signOut: vi.fn(),
  resolvedTheme: "light",
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({
    resolvedTheme: mocks.resolvedTheme,
    setTheme: mocks.setTheme,
  }),
}));
vi.mock("next-auth/react", () => ({ signOut: mocks.signOut }));

describe("HeaderActions", () => {
  beforeEach(() => {
    mocks.resolvedTheme = "light";
  });

  it("switches to the dark theme from the light theme", async () => {
    const user = userEvent.setup();
    render(<HeaderActions />);

    await user.click(screen.getByRole("button", { name: "Toggle theme" }));

    expect(mocks.setTheme).toHaveBeenCalledWith("dark");
  });

  it("switches to the light theme from the dark theme", async () => {
    const user = userEvent.setup();
    mocks.resolvedTheme = "dark";
    render(<HeaderActions />);

    await user.click(screen.getByRole("button", { name: "Toggle theme" }));

    expect(mocks.setTheme).toHaveBeenCalledWith("light");
  });

  it("signs out with a redirect to the login page", async () => {
    const user = userEvent.setup();
    render(<HeaderActions />);

    // theme, notifications, sign out — the sign-out button has no accessible name
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
    await user.click(buttons[2]);

    expect(mocks.signOut).toHaveBeenCalledWith({ callbackUrl: "/login" });
  });

  it("renders the notifications action", () => {
    render(<HeaderActions />);

    expect(
      screen.getByRole("button", { name: "Notifications" }),
    ).toBeInTheDocument();
  });
});
