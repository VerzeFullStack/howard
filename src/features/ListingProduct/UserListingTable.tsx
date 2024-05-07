import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import TablePagination from "../../tableComponents/TablePagination";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAccessToken, selectClaims } from "../UserLoginState/UserSlice";
import {
  LoadingStatus,
  fetchProduct,
  refreshData,
  selectListingProduct,
} from "./ListingProductSlice";
import { ProductType } from "../../typeProps/ProductType";
import ListingFilter from "./ListingFilter";
import ListingProductForm from "./ListingProductForm";
import ReactModal from "react-modal";

function UserListingTable() {
  const dispatch = useAppDispatch();
  const claims = useAppSelector(selectClaims);
  const userTokenId = claims?.sub;
  const accessToken = useAppSelector(selectAccessToken);
  const listingProduct = useAppSelector(selectListingProduct);
  const productStatus = useAppSelector((state) => state.listingProduct.loading);

  useEffect(() => {
    if (productStatus === LoadingStatus.Idle && accessToken != null) {
      dispatch(fetchProduct(userTokenId));
    }
  }, [productStatus, dispatch, userTokenId, accessToken]);

  const columns = React.useMemo<ColumnDef<ProductType>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        enableSorting: false,
        enableColumnFilter: true,
        filterFn: "includesString",
        //this column will sort in ascending order by default since it is a string column
      },
      {
        accessorKey: "productName",
        header: "ProductName",
        enableSorting: false,
      },
      {
        accessorKey: "category",
        header: "Category",
        enableColumnFilter: false,

        //this column will sort in descending order by default since it is a number column
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

  const table = useReactTable({
    data: listingProduct,
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

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  ReactModal.setAppElement("#root");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [modalIsOpen, setIsOpen] = React.useState(false);

  const [selectedProduct, setSelectedProduct] = useState<ProductType>();

  function openModal(product: ProductType) {
    setIsOpen(true);
    setSelectedProduct(product);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div className="main">
      {accessToken ? (
        productStatus == LoadingStatus.Loading ? (
          <>
            <h3>Loading...</h3>
          </>
        ) : (
          <>
            <div>
              <ListingProductForm
                selectedProduct={selectedProduct}
                closeModal={closeModal}
              />
              <ReactModal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
              >
                <button onClick={closeModal}>Close</button>
              </ReactModal>
            </div>
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
                                onClick:
                                  header.column.getToggleSortingHandler(),
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
                                  <ListingFilter
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
                      <tr
                        key={row.id}
                        onClick={() => openModal(row.original)}
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
                    </>
                  );
                })}
              </tbody>
            </table>
            <TablePagination table={table} />
            <div>{table.getPrePaginationRowModel().rows.length} Rows</div>
            <pre>{JSON.stringify(table.getState().pagination, null, 2)}</pre>
            <button onClick={() => dispatch(refreshData())}>
              Refresh Data
            </button>
          </>
        )
      ) : (
        <>
          <h1>Please Login In.</h1>
        </>
      )}
    </div>
  );
}

export default UserListingTable;
