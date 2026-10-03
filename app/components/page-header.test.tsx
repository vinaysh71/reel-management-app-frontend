import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PageHeader from "./page-header";

describe("PageHeader", () => {
  it("renders title and description", () => {
    render(
      <PageHeader title="Reels" description="Manage all reels" />,
    );

    expect(screen.getByRole("heading", { name: "Reels" })).toBeInTheDocument();
    expect(screen.getByText("Manage all reels")).toBeInTheDocument();
  });

  it("omits the description slot when not provided", () => {
    render(<PageHeader title="Suppliers" />);

    expect(screen.getByRole("heading", { name: "Suppliers" })).toBeInTheDocument();
    expect(screen.queryByText("Manage all reels")).not.toBeInTheDocument();
  });

  it("invokes the primary action callback on click", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<PageHeader title="Reels" primaryAction={{ label: "Add Reel", onClick }} />);

    await user.click(screen.getByRole("button", { name: "Add Reel" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders the primary action as a link when an href is given", () => {
    render(<PageHeader title="Reels" primaryAction={{ label: "Export", href: "/export" }} />);

    const link = screen.getByRole("link", { name: "Export" });
    expect(link).toHaveAttribute("href", "/export");
  });

  it("renders extra actions from children", () => {
    render(
      <PageHeader title="Reels">
        <button type="button">Extra</button>
      </PageHeader>,
    );

    expect(screen.getByRole("button", { name: "Extra" })).toBeInTheDocument();
  });

  it("renders no primary action when none is provided", () => {
    render(<PageHeader title="Reels" />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
