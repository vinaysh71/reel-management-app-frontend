import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./data-table";

type Person = { name: string; age: number };

const columns: ColumnDef<Person>[] = [
  { accessorKey: "name", header: "Name", meta: { filterable: true } },
  { accessorKey: "age", header: "Age" },
];

const people: Person[] = [
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 },
  { name: "Carol", age: 40 },
  { name: "Dave", age: 22 },
  { name: "Eve", age: 35 },
  { name: "Frank", age: 28 },
  { name: "Grace", age: 31 },
  { name: "Heidi", age: 26 },
  { name: "Ivan", age: 29 },
  { name: "Judy", age: 33 },
  { name: "Mallory", age: 27 },
  { name: "Niaj", age: 24 },
];

const allFeatures = {
  isSearchable: true,
  showColumnChooser: true,
  isFilterable: true,
  isSortable: true,
  showPagination: true,
};

describe("DataTable", () => {
  it("renders headers and the first page of rows", () => {
    render(<DataTable columns={columns} data={people} properties={allFeatures} />);

    expect(screen.getByRole("columnheader", { name: "Name" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Age" })).toBeInTheDocument();
    // header row + 10 body rows (default page size)
    expect(screen.getAllByRole("row")).toHaveLength(11);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("Mallory")).not.toBeInTheDocument();
  });

  it("paginates through pages", async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={people} properties={allFeatures} />);

    expect(screen.getByText(/Page 1 of 2/)).toBeInTheDocument();
    const previous = screen.getByRole("button", { name: "Previous" });
    expect(previous).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText(/Page 2 of 2/)).toBeInTheDocument();
    expect(screen.getByText("Mallory")).toBeInTheDocument();
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Previous" }));

    expect(screen.getByText(/Page 1 of 2/)).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("filters rows with the global search box", async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={people} properties={allFeatures} />);

    await user.type(screen.getByPlaceholderText("Search reels..."), "Bob");

    expect(screen.getAllByRole("row")).toHaveLength(2); // header + Bob
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
  });

  it("shows the empty state when a search matches nothing", async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={people} properties={allFeatures} />);

    await user.type(screen.getByPlaceholderText("Search reels..."), "zzz");

    expect(screen.getByText("No results.")).toBeInTheDocument();
  });

  it("shows the empty state for empty data", () => {
    render(<DataTable columns={columns} data={[]} properties={allFeatures} />);

    expect(screen.getByText("No results.")).toBeInTheDocument();
  });

  it("applies and clears a per-column filter", async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={people} properties={allFeatures} />);

    const filterSelect = screen.getAllByRole("combobox")[0];
    await user.click(filterSelect);
    await user.click(await screen.findByRole("option", { name: "Alice" }));

    expect(screen.getAllByRole("row")).toHaveLength(2); // header + Alice
    expect(screen.getAllByText("Alice").length).toBeGreaterThan(0);
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear Filters" }));

    expect(screen.getAllByRole("row")).toHaveLength(11);
  });

  it("hides columns through the column chooser", async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={people} properties={allFeatures} />);

    await user.click(screen.getByRole("button", { name: /Columns/ }));
    const ageToggle = await screen.findByRole("menuitemcheckbox", { name: "age" });
    await user.click(ageToggle);

    expect(screen.queryByRole("columnheader", { name: "Age" })).not.toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Name" })).toBeInTheDocument();
    // data itself remains visible
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("omits toolbar features that are not enabled", () => {
    render(<DataTable columns={columns} data={people} />);

    expect(screen.queryByPlaceholderText("Search reels...")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Columns/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    // rows still render
    expect(within(screen.getAllByRole("row")[1]).getByText("Alice")).toBeInTheDocument();
  });
});
