import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppSidebarLink } from "./app-sidebar-link";

const mocks = vi.hoisted(() => ({ pathname: "/reels" }));

vi.mock("next/navigation", () => ({ usePathname: () => mocks.pathname }));

function TestIcon(props: { className?: string }) {
  return <span data-testid="test-icon" className={props.className} />;
}

describe("AppSidebarLink", () => {
  beforeEach(() => {
    mocks.pathname = "/reels";
  });

  it("renders a link with label and icon", () => {
    render(<AppSidebarLink href="/reels" label="Reels" icon={TestIcon} />);

    const link = screen.getByRole("link", { name: "Reels" });
    expect(link).toHaveAttribute("href", "/reels");
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("marks the link active for the current path", () => {
    mocks.pathname = "/reels";
    render(<AppSidebarLink href="/reels" label="Reels" />);

    expect(screen.getByRole("link", { name: "Reels" }).className).toContain(
      "bg-primary/10",
    );
  });

  it("keeps other links inactive", () => {
    mocks.pathname = "/reels";
    render(<AppSidebarLink href="/suppliers" label="Suppliers" />);

    expect(screen.getByRole("link", { name: "Suppliers" }).className).not.toContain(
      "bg-primary/10",
    );
  });

  it("renders without an icon when none is given", () => {
    render(<AppSidebarLink href="/dashboard" label="Dashboard" />);

    expect(screen.getByRole("link", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.queryByTestId("test-icon")).not.toBeInTheDocument();
  });
});
