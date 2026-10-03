import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import DashboardLayout from "./layout";

vi.mock("next-auth", () => ({ getServerSession: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("@/app/components/side-bar", () => ({
  default: function SidebarMock({ children }: { children: React.ReactNode }) {
    return <div data-testid="sidebar-shell">{children}</div>;
  },
}));

describe("protected main layout", () => {
  beforeEach(() => {
    vi.mocked(getServerSession).mockReset();
    vi.mocked(redirect).mockReset();
    // The real next/redirect throws to abort rendering — mirror that.
    vi.mocked(redirect).mockImplementation(() => {
      throw new Error("NEXT_REDIRECT");
    });
  });

  it("redirects to /login when there is no session", async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    await expect(
      DashboardLayout({ children: <div data-testid="child">secret</div> }),
    ).rejects.toThrow("NEXT_REDIRECT");

    expect(redirect).toHaveBeenCalledWith("/login");
    expect(getServerSession).toHaveBeenCalledTimes(1);
  });

  it("renders the children inside the sidebar when a session exists", async () => {
    vi.mocked(getServerSession).mockResolvedValue({} as never);

    const ui = await DashboardLayout({
      children: <div data-testid="child">secret</div>,
    });
    render(ui);

    expect(redirect).not.toHaveBeenCalled();
    expect(screen.getByTestId("sidebar-shell")).toBeInTheDocument();
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});
