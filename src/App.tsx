import React from 'react'

import {
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query'

import {
  useReactTable,
  PaginationState,
  ColumnDef,
  flexRender,
  SortingFn,
  SortingState,
  getCoreRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  Row,
} from '@tanstack/react-table'

import './styles/App.css';

import { fetchData, makeData, Person } from './makeData'
// import { styled } from '@chakra-ui/react';

function App () {
  const rerender = React.useReducer(() => ({}), {})[1]

  //custom sorting logic for one of our enum columns
const sortStatusFn: SortingFn<Person> = (rowA, rowB) => {
  const statusA = rowA.original.status
  const statusB = rowB.original.status
  const statusOrder = ['single', 'complicated', 'relationship']
  return statusOrder.indexOf(statusA) - statusOrder.indexOf(statusB)
}

  const columns = React.useMemo<ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'firstName',
        cell: ({ row, getValue }) => (
          <div
            style={{
              // Since rows are flattened by default,
              // we can use the row.depth property
              // and paddingLeft to visually indicate the depth
              // of the row
              paddingLeft: `${row.depth * 2}rem`,
            }}
          >
            {getValue<string>()}
          </div>
        ),
        footer: props => props.column.id,
        //this column will sort in ascending order by default since it is a string column
      },
      {
        accessorFn: row => row.lastName,
        id: 'lastName',
        cell: info => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: props => props.column.id,
        sortUndefined: 'last', //force undefined values to the end
        sortDescFirst: false, //first sort order will be ascending (nullable values can mess up auto detection of sort order)
      },
      {
        accessorKey: 'age',
        header: () => 'Age',
        footer: props => props.column.id,
        //this column will sort in descending order by default since it is a number column
      },
      {
        accessorKey: 'visits',
        header: () => <span>Visits</span>,
        footer: props => props.column.id,
        sortUndefined: 'last', //force undefined values to the end
      },
      {
        accessorKey: 'status',
        header: 'Status',
        footer: props => props.column.id,
        sortingFn: sortStatusFn, //use our custom sorting function for this enum column
      },
      {
        accessorKey: 'progress',
        header: 'Profile Progress',
        footer: props => props.column.id,
        // enableSorting: false, //disable sorting for this column
      },
      {
        accessorKey: 'rank',
        header: 'Rank',
        footer: props => props.column.id,
        invertSorting: true, //invert the sorting order (golf score-like where smaller is better)
      },
      {
        accessorKey: 'createdAt',
        header: 'Created At',
        footer: props => props.column.id,
        // sortingFn: 'datetime' //make sure table knows this is a datetime column (usually can detect if no null values)
      },
    ],
    []
  )

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const [sorting, setSorting] = React.useState<SortingState>([])

  const dataQuery = useQuery({
    queryKey: ['data', pagination],
    queryFn: () => fetchData(pagination),
    placeholderData: keepPreviousData, // don't have 0 rows flash while changing pages/loading next page
  })
  
  const [data, setData] = React.useState(() => makeData(1_000))
  const refreshData = () => setData(() => makeData(100_000)) //stress test with 100k rows

  type TableProps<TData> = {
    data: TData[]
    columns: ColumnDef<TData>[]
    renderSubComponent: (props: { row: Row<TData> }) => React.ReactElement
    getRowCanExpand: (row: Row<TData>) => boolean
  }

  function Table({
    data,
    columns,
    renderSubComponent,
    getRowCanExpand,
  }: TableProps<Person>): JSX.Element {
  const table = useReactTable({
    data: dataQuery.data?.rows ?? data,
    columns,
    getRowCanExpand,
    // getRowCanExpand,
    // pageCount: dataQuery.data?.pageCount ?? -1, //you can now pass in `rowCount` instead of pageCount and `pageCount` will be calculated internally (new in v8.13.0)
    rowCount: dataQuery.data?.rowCount, // new in v8.13.0 - alternatively, just pass in `pageCount` directly
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSortedRowModel: getSortedRowModel(), //client-side sorting
    onSortingChange: setSorting, //optionally control sorting state in your own scope for easy access
    // sortingFns: {
    //   sortStatusFn, //or provide our custom sorting function globally for all columns to be able to use
    // },
    //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    manualPagination: true, //we're doing manual "server-side" pagination
    // getPaginationRowModel: getPaginationRowModel(), // If only doing manual pagination, you don't need this
    // autoResetPageIndex: false, // turn off page index reset when sorting or filtering - default on/true
    // enableMultiSort: false, //Don't allow shift key to sort multiple columns - default on/true
    // enableSorting: false, // - default on/true
    // enableSortingRemoval: false, //Don't allow - default on/true
    // isMultiSortEvent: (e) => true, //Make all clicks multi-sort - default requires `shift` key
    // maxMultiSortColCount: 3, // only allow 3 columns to be sorted at once - default is Infinity
    debugTable: true,
  }
)

return (
  <>
  
  <div className="p-2">
    <div className="h-2" />
    <table>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => {
              return (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <div
                      className={
                        header.column.getCanSort()
                          ? 'cursor-pointer select-none'
                          : ''
                      }
                      onClick={header.column.getToggleSortingHandler()}
                      title={
                        header.column.getCanSort()
                          ? header.column.getNextSortingOrder() === 'asc'
                            ? 'Sort ascending'
                            : header.column.getNextSortingOrder() === 'desc'
                              ? 'Sort descending'
                              : 'Clear sort'
                          : undefined
                      }
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  )}
                </th>
              )
            })}
          </tr>
        ))}
      </thead>
      <tbody>
        {table
          .getRowModel()
          .rows.slice(0, 10)
          .map(row => {
            return (
              <>
              <tr key={row.id} onClick={row.getToggleExpandedHandler()}>
                {row.getVisibleCells().map(cell => {
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  )
                })}
              </tr>
               {row.getIsExpanded() && (
                <tr>
                  {/* 2nd row is a custom 1 cell row */}
                  <td colSpan={row.getVisibleCells().length}>
                    {renderSubComponent({ row })}
                  </td>
                </tr>
              )}
              </>
            )
        })}
      </tbody>
    </table>
    <div className="h-2" />
    <div className="flex items-center gap-2">
      <button
        className="border rounded p-1"
        onClick={() => table.firstPage()}
        disabled={!table.getCanPreviousPage()}
      >
        {'<<'}
      </button>
      <button
        className="border rounded p-1"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        {'<'}
      </button>
      <button
        className="border rounded p-1"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        {'>'}
      </button>
      <button
        className="border rounded p-1"
        onClick={() => table.lastPage()}
        disabled={!table.getCanNextPage()}
      >
        {'>>'}
      </button>
      <span className="flex items-center gap-1">
        <div>Page</div>
        <strong>
          {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount().toLocaleString()}
        </strong>
      </span>
      <span className="flex items-center gap-1">
        | Go to page:
        <input
          type="number"
          defaultValue={table.getState().pagination.pageIndex + 1}
          onChange={e => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0
            table.setPageIndex(page)
          }}
          className="border p-1 rounded w-16"
        />
      </span>
      <select
        value={table.getState().pagination.pageSize}
        onChange={e => {
          table.setPageSize(Number(e.target.value))
        }}
      >
        {[10, 20, 30, 40, 50].map(pageSize => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
      {dataQuery.isFetching ? 'Loading...' : null}
    </div>
    <div>
      Showing {table.getRowModel().rows.length.toLocaleString()} of{' '}
      {dataQuery.data?.rowCount.toLocaleString()} Rows
    </div>
    <div>
      <button onClick={() => rerender()}>Force Rerender</button>
    </div>
    <div>
      <button onClick={() => refreshData()}>Refresh Data</button>
    </div>
    <pre>{JSON.stringify(pagination, null, 2)}</pre>
    <pre>{JSON.stringify(sorting, null, 2)}</pre>
  </div>
  </>
)
}

const renderSubComponent = ({ row }: { row: Row<Person> }) => {
  return (
    <pre style={{ fontSize: '10px' }}>
      <code>{JSON.stringify(row.original, null, 2)}</code>
    </pre>
  )
}
  //access sorting state from the table instance
  // console.log(table.getState().sorting)

  return (
    <Table
      data={data}
      columns={columns}
      getRowCanExpand={() => true}
      renderSubComponent={renderSubComponent}
    />
  )
}
  
export default App
