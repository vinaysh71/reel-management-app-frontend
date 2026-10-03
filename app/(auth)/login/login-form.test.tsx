import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signIn } from "next-auth/react";
import LoginForm from "./login-form";

vi.mock("next-auth/react", () => ({ signIn: vi.fn() }));

describe("LoginForm", () => {
  it("renders the login call to action", () => {
    render(<LoginForm />);

    expect(
      screen.getByRole("heading", { name: "Reel Management System" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Continue with Company Login" }),
    ).toBeInTheDocument();
  });

  it("signs in with the zitadel provider and redirects to the dashboard", async () => {
    const user = userEvent.setup();
    vi.mocked(signIn).mockResolvedValue(undefined as never);
    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: "Continue with Company Login" }));

    expect(signIn).toHaveBeenCalledTimes(1);
    expect(signIn).toHaveBeenCalledWith("zitadel", { callbackUrl: "/dashboard" });
  });
});
