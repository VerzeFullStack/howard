import React, { Fragment, useEffect } from "react";
import "../styles/ProductTable.css";

import {
  useReactTable,
  PaginationState,
  ColumnDef,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  SortingState,
  getCoreRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  Row,
} from "@tanstack/react-table";

import { getProduct } from "../api/GetListingProductAPI";
import TableFilter from "./TableFilter";
import { useAppSelector } from "../app/hooks";
import { selectAccessToken } from "../features/UserLoginState/UserSlice";
import TablePagination from "./TablePagination";
import { ListingProductType } from "../typeProps/ListingProductType";

function ProductTable() {
  const accessToken = useAppSelector(selectAccessToken);

  const columns = React.useMemo<ColumnDef<ListingProductType>[]>(
    () => [
      {
        accessorKey: "productName",
        header: "Product Name",
        enableSorting: false,
        enableColumnFilter: true,
        //this column will sort in ascending order by default since it is a string column
      },
      {
        accessorKey: "category",
        header: "Category",
        enableSorting: false,
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
        enableColumnFilter: false,
        //this column will sort in descending order by default since it is a number column
      },
      {
        accessorKey: "price",
        header: "Price",
        // meta: {
        //   filterVariant: "range",
        // },
        sortUndefined: "last", //force undefined values to the end
        sortDescFirst: false, //first sort order will be ascending (nullable values can mess up auto detection of sort order)
        enableColumnFilter: false,
      },
      {
        accessorKey: "seller.displayName",
        header: () => "Seller",
        enableSorting: false,
      },
    ],
    []
  );

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [data, setData] = React.useState<ListingProductType[]>([]);

  async function fetchListingProducts() {
    const response = await getProduct();
    setData(response.data);
  }

  useEffect(() => {
    if (accessToken != null) {
      fetchListingProducts();
    }
  }, [accessToken]);

  const table = useReactTable({
    data,
    columns,
    filterFns: {},
    getRowCanExpand: () => true,
    onSortingChange: setSorting, //optionally control sorting state in your own scope for easy access
    // sortingFns: {
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), //client-side sorting
    //sortStatusFn,//or provide our custom sorting function globally for all columns to be able to use
    onColumnFiltersChange: setColumnFilters,
    getExpandedRowModel: getExpandedRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //client side filtering
    getPaginationRowModel: getPaginationRowModel(), //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
    state: {
      pagination,
      sorting,
      columnFilters,
    },
    // manualPagination: true, //we're doing manual "server-side" pagination
    // autoResetPageIndex: false, // turn off page index reset when sorting or filtering - default on/true
    // enableMultiSort: false, //Don't allow shift key to sort multiple columns - default on/true
    // enableSorting: false, // - default on/true
    // enableSortingRemoval: false, //Don't allow - default on/true
    // isMultiSortEvent: (e) => true, //Make all clicks multi-sort - default requires `shift` key
    // maxMultiSortColCount: 3, // only allow 3 columns to be sorted at once - default is Infinity
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  const renderSubComponent = ({ row }: { row: Row<ListingProductType> }) => {
    return (
      <div
        className={"productDetails " + (row.getIsExpanded() ? "tb-expand" : "")}
      >
        <p>Description: {row.original.description}</p>
        <div style={{ textAlign: "right" }}>
          <button className="buyBtn">Buy Now</button>
        </div>
      </div>
    );
  };

  return (
    <div className="main">
      {accessToken ? (
        <>
          <table>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : (
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : "",
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: " 🔼",
                              desc: " 🔽",
                            }[header.column.getIsSorted() as string] ?? null}
                            {header.column.getCanFilter() ? (
                              <div>
                                <TableFilter
                                  column={header.column}
                                  table={table}
                                />
                              </div>
                            ) : null}
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => {
                return (
                  <>
                    <Fragment key={row.id}>
                      <tr
                        onClick={row.getToggleExpandedHandler()}
                        className="cursor-pointer tr-hover"
                      >
                        {row.getVisibleCells().map((cell) => {
                          return (
                            <td key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          );
                        })}
                      </tr>
                      <tr>
                        {/* 2nd row is a custom 1 cell row */}
                        <td colSpan={row.getVisibleCells().length}>
                          {renderSubComponent({ row })}
                        </td>
                      </tr>
                    </Fragment>
                  </>
                );
              })}
            </tbody>
          </table>
          <TablePagination table={table} />
          <div>{table.getPrePaginationRowModel().rows.length} Rows</div>
          <div>
            {/* <button onClick={() => refreshData()}>Refresh Data</button> */}
          </div>
          <pre>{JSON.stringify(table.getState().pagination, null, 2)}</pre>
        </>
      ) : (
        <>
          <h1>Please Login In.</h1>
        </>
      )}
    </div>
  );
}

export default ProductTable;
