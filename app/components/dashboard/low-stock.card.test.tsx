import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import LowStockCard from "./low-stock.card";
import { getLowStocks } from "@/lib/dashboard/dashboard.api";

vi.mock("@/lib/dashboard/dashboard.api", () => ({ getLowStocks: vi.fn() }));

describe("LowStockCard", () => {
  it("lists low-stock reels with their stock rendered in a badge", async () => {
    vi.mocked(getLowStocks).mockResolvedValue([
      { id: "1", reelNo: "R001", stock: 2 },
      { id: "2", reelNo: "R002", stock: 0 },
    ]);

    const ui = await LowStockCard();
    render(ui);

    expect(screen.getByText("Low stock reels")).toBeInTheDocument();
    expect(screen.getByText("R001")).toBeInTheDocument();
    expect(screen.getByText("R002")).toBeInTheDocument();

    // The stock count must render inside the UI Badge component (a span),
    // not an SVG icon from lucide-react.
    const badge = screen.getByText("2");
    expect(badge.tagName).toBe("SPAN");
    expect(badge).toHaveAttribute("data-slot", "badge");
    expect(screen.getByText("0").tagName).toBe("SPAN");
  });
});
