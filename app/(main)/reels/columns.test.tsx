import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CellContext } from "@tanstack/react-table";
import { reelsColumns, ReelColumns } from "./columns";

function ctx(row: Partial<ReelColumns>): CellContext<ReelColumns, unknown> {
  return {
    row: {
      original: row as ReelColumns,
      getValue: (key: keyof ReelColumns) => row[key],
    },
  } as unknown as CellContext<ReelColumns, unknown>;
}

function columnFor(id: string) {
  const column = reelsColumns.find(
    (col) => col.id === id || ("accessorKey" in col && col.accessorKey === id),
  );
  if (!column) throw new Error(`column ${id} not found`);
  return column;
}

function renderCell(id: string, row: Partial<ReelColumns>) {
  const cell = columnFor(id).cell;
  if (!cell) throw new Error(`column ${id} has no cell renderer`);
  if (typeof cell !== "function") {
    throw new Error(`column ${id} cell is not a renderer function`);
  }
  return render(<>{cell(ctx(row))}</>);
}

describe("reelsColumns", () => {
  it("renders the reel number emphasised", () => {
    renderCell("reelNo", { reelNo: "R001234" });

    const cell = screen.getByText("R001234");
    expect(cell).toBeInTheDocument();
    expect(cell.className).toContain("font-medium");
  });

  it("renders the supplier name from the relation", () => {
    renderCell("supplier", {
      supplier: { id: 1, name: "Acme Papers" } as ReelColumns["supplier"],
    });

    expect(screen.getByText("Acme Papers")).toBeInTheDocument();
  });

  it("renders an empty supplier safely", () => {
    const { container } = renderCell("supplier", {
      supplier: undefined as unknown as ReelColumns["supplier"],
    });

    expect(container.textContent).toBe("");
  });

  const numericCases: Array<[keyof ReelColumns & string, number, string]> = [
    ["gsm", 150, "150"],
    ["gsm", 0, "-"],
    ["ply", 3, "3"],
    ["ply", 0, "-"],
  ];

  it.each(numericCases)("renders %s as %i -> %s", (columnId, value, expected) => {
    renderCell(columnId, { [columnId]: value } as Partial<ReelColumns>);

    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it("renders weights with the kg unit", () => {
    const { container } = renderCell("grossWeight", { grossWeight: 1000 });

    expect(container.textContent).toContain("1000");
    expect(container.textContent).toContain("kg");
  });

  it.each([
    ["Available", "bg-emerald-600/90"],
    ["In Use", "bg-blue-600"],
    ["Damaged", "bg-red-600"],
    ["Consumed", "bg-neutral-600"],
  ] as const)("styles the %s status as %s", (status, expectedClass) => {
    renderCell("status", { status });

    const badge = screen.getByText(status);
    expect(badge.className).toContain(expectedClass);
  });

  it("marks the searchable/filterable columns via meta", () => {
    expect(columnFor("reelNo").meta?.filterable).toBe(true);
    expect(columnFor("supplier").meta?.filterable).toBe(true);
    expect(columnFor("status").meta?.filterable).toBe(true);
    expect(columnFor("gsm").meta?.filterable).toBeUndefined();
  });
});
