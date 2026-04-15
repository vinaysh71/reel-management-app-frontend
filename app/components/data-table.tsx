"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFacetedRowModel, // ← ADD
  getFacetedUniqueValues, // ← ADD
  useReactTable,
  RowData,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Supplier } from "@/lib/supplier/supplier.types";

declare module "@tanstack/table-core" {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterable?: boolean;
  }
}

interface Properties {
  isSortable?: boolean;
  isFilterable?: boolean;
  isSearchable?: boolean;
  showColumnChooser?: boolean;
  showPagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  properties?: Properties;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  properties,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: properties?.pageSize || 10,
  });

  const pageSizeOptions = properties?.pageSizeOptions || [10, 20, 50, 100];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    state: {
      sorting,
      globalFilter,
      columnVisibility,
      columnFilters,
      pagination,
    },
  });

  return (
    <div className="rounded-md border">
      {/* TOOLBAR */}
      <div className="flex items-center gap-3 py-4 px-4 bg-gray-50/50 dark:bg-gray-900/50 rounded-t-lg">
        {/* SEARCH */}
        <div>
          {properties?.isSearchable && (
            <input
              placeholder="Search reels..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(String(e.target.value))}
              className="h-9 w-full rounded-md border py-2 px-2"
            />
          )}
        </div>

        {/* DYNAMIC COLUMN FILTERS */}
        {properties?.isFilterable && (
          <div className="flex flex-wrap gap-2 ml-4 mb-5">
            {table
              .getAllColumns()
              .filter((col) => col.columnDef.meta?.filterable)
              .map((column) => (
                <div
                  key={column.id}
                  className="flex flex-col gap-1 min-w-[140px]"
                >
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {column.id}
                  </label>
                  <Select
                    value={(column.getFilterValue() as string) ?? "__all__"}
                    onValueChange={(value) => {
                      if (value === "__all__") {
                        column.setFilterValue(undefined); // clear filter
                      } else {
                        column.setFilterValue(value);
                      }
                    }}
                  >
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue placeholder={`All ${column.id}`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__all__">All</SelectItem>
                      {Array.from(column.getFacetedUniqueValues()?.keys() || [])
                        .slice(0, 10)
                        .map((key) => {
                          let value: string;
                          if (typeof key === "object" && key !== null) {
                            value = key.id?.toString() ?? JSON.stringify(key);
                          } else {
                            value = String(key);
                          }
                          return (
                            <SelectItem
                              key={`${value}-${column.id}`}
                              value={value}
                            >
                              {typeof key === "object" && key !== null
                                ? key.name || value
                                : value}
                            </SelectItem>
                          );
                        })}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            {table.getState().columnFilters.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.resetColumnFilters()}
                className="h-9 px-3 mt-auto"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {/* COLUMN CHOOSER */}
        {properties?.showColumnChooser && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto h-9 px-3">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table.getAllColumns().map(
                (column) =>
                  column.getCanHide() && (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ),
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* TABLE */}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* PAGINATION */}
      {properties?.showPagination && table.getRowModel().rows?.length && (
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
            <Select
              value={table.getState().pagination.pageSize.toString()}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="w-20 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toString()}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
