import { CustomFlowbiteTheme, Table, Progress } from "flowbite-react";
import Card from "@/components/ui/card/Card";
import IconButton from "@/components/ui/button/IconButton";
import { useState, useEffect } from "react";

interface TableHeaderType {
  key: string;
  child: string | JSX.Element;
}

export interface TableDataType {
  [key: string]: string | JSX.Element;
}

interface TableType {
  header: Array<TableHeaderType>;
  data: Array<TableDataType>;
  loading: boolean;
  initialPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  serverPagination: boolean;
}

const firstPageIcon: JSX.Element = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="size-6 stroke-2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
    />
  </svg>
);

const lastPageIcon: JSX.Element = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="size-6 stroke-2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
    />
  </svg>
);

const previousPageIcon: JSX.Element = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="size-6 stroke-2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 19.5 8.25 12l7.5-7.5"
    />
  </svg>
);

const nextPageIcon: JSX.Element = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="size-6 stroke-2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m8.25 4.5 7.5 7.5-7.5 7.5"
    />
  </svg>
);

// for update flowbite theme
// table theme
const customTableTheme: CustomFlowbiteTheme["table"] = {
  root: {
    base: "w-full text-left text-sm text-gray-500 divide-y",
  },
  head: {
    base: "group/head text-sm uppercase text-gray-700",
    cell: {
      base: "bg-white px-6 py-3 group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg",
    },
  },
  body: {
    base: "group/body bg-white divide-y",
    cell: {
      base: "px-6 py-4 text-sm group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg",
    },
  },
  row: {
    hovered: "hover:bg-gray-50",
  },
};

// progress linear theme
const customProgressTheme: CustomFlowbiteTheme["progress"] = {
  base: "relative w-full overflow-hidden bg-white",
  bar: "progress-bar space-x-2 text-center font-medium leading-none",
  color: {
    accent: "bg-accent",
  },
  size: {
    xs: "h-1",
  },
};

function PaginationTable(props: TableType) {
  const [page, setPage] = useState(props.initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [formatData, setFormatData] = useState([] as Array<Array<JSX.Element>>);

  // format table data
  const getTableData = (): Array<Array<JSX.Element>> => {
    const tableData: Array<Array<JSX.Element>> = [];
    let startRowIndex = 0;
    let endRowIndex = 0;
    if (props.serverPagination) {
      endRowIndex = props.data.length;
    } else {
      startRowIndex = (page - 1) * props.itemsPerPage;
      endRowIndex = page * props.itemsPerPage;

      if (endRowIndex > props.totalItems) {
        endRowIndex = props.totalItems;
      }
    }

    const header = props.header;
    const data = props.data;

    for (let i = startRowIndex; i < endRowIndex; i++) {
      const dataKey = Object.keys(data[i]);
      const tempElement: Array<JSX.Element> = [];

      for (let k = 0; k < header.length; k++) {
        let element: JSX.Element | string = <span></span>;

        const index = dataKey.indexOf(header[k].key);
        if (index !== -1) {
          if (typeof data[i][header[k].key] === "string") {
            element = <span>{data[i][header[k].key]}</span>;
          } else {
            element = data[i][header[k].key];
          }
        }

        tempElement.push(
          <Table.Cell
            className="whitespace-nowrap font-medium text-gray-900"
            key={`data_cell_${i}_${k}`}
          >
            {element}
          </Table.Cell>
        );
      }

      tableData.push(tempElement);
    }

    return tableData;
  };

  useEffect(() => {
    // update the total pages
    const currentTotalPages = Math.ceil(props.totalItems / props.itemsPerPage);
    setTotalPages(currentTotalPages);
  }, [props.totalItems, props.itemsPerPage]);

  useEffect(() => {
    // format data when props.data / current page / total items updated
    setFormatData(getTableData());
  }, [props.header, props.data, props.serverPagination, totalPages, page]);

  return (
    <div className="overflow-x-auto">
      <Table theme={customTableTheme} hoverable>
        <Table.Head>
          {/* table header */}
          {props.header.map((header: TableHeaderType) => {
            return (
              <Table.HeadCell key={`header_${header.key}`}>
                {typeof header.child === "string" ? (
                  <span>{header.child}</span>
                ) : (
                  header.child
                )}
              </Table.HeadCell>
            );
          })}
        </Table.Head>

        {/* table content */}
        <Table.Body className="divide-y">
          {/* loading row */}
          {props.loading ? (
            <Table.Row className="hover:bg-transparent">
              <Table.Cell
                className="pt-0 pl-0 pr-0"
                colSpan={props.header.length}
              >
                <Progress
                  progress={100}
                  size="xs"
                  color="accent"
                  theme={customProgressTheme}
                ></Progress>
                <p className="text-center mt-3">Loading...</p>
              </Table.Cell>
            </Table.Row>
          ) : null}

          {props.data.length > 0 ? (
            /* formatted data row */
            formatData.map((row: Array<JSX.Element>, index: number) => {
              return <Table.Row key={`data_${index}`}>{row}</Table.Row>;
            })
          ) : (
            /* No data text */
            <Table.Row className="hover:bg-transparent">
              <Table.Cell colSpan={props.header.length}>
                <p className="text-center">No Data</p>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>

      {/* pagination */}
      <Card
        flat={true}
        className="border-[#E5E7EB] border-solid border-t rounded-t-[0px]"
      >
        <div className="flex items-center justify-between text-wrap">
          <div className="text-xs text-gray-400">
            {page} - {totalPages} of {props.totalItems}
          </div>
          <div>
            {/* go to first page */}
            <IconButton
              disabled={
                props.loading ||
                page === 1 ||
                props.data.length === 0 ||
                props.totalItems === 0
              }
              icon={firstPageIcon}
              plain={true}
              small={true}
              bgColor="#5b6c7c"
              iconColor="#9aaebb"
              onClick={() => {
                setPage(1);
              }}
            ></IconButton>

            {/* previous page */}
            <IconButton
              disabled={
                props.loading ||
                page === 1 ||
                props.data.length === 0 ||
                props.totalItems === 0
              }
              icon={previousPageIcon}
              plain={true}
              small={true}
              bgColor="#5b6c7c"
              iconColor="#6d8294"
              onClick={() => {
                setPage((prev: number) => {
                  return prev - 1;
                });
              }}
            ></IconButton>

            {/* next page */}
            <IconButton
              disabled={
                props.loading ||
                page === totalPages ||
                props.data.length === 0 ||
                props.totalItems === 0
              }
              icon={nextPageIcon}
              plain={true}
              small={true}
              bgColor="#5b6c7c"
              iconColor="#6d8294"
              onClick={() => {
                setPage((prev: number) => {
                  return prev + 1;
                });
              }}
            ></IconButton>

            {/* go to last page */}
            <IconButton
              disabled={
                props.loading ||
                page === totalPages ||
                props.data.length === 0 ||
                props.totalItems === 0
              }
              icon={lastPageIcon}
              plain={true}
              small={true}
              bgColor="#5b6c7c"
              iconColor="#9aaebb"
              onClick={() => {
                setPage(totalPages);
              }}
            ></IconButton>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default PaginationTable;
