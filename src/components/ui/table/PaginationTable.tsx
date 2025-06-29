import { Table, Progress } from "flowbite-react";
import Card from "@/components/ui/card/Card";
import { useState, useEffect, useContext } from "react";
import IconButton from "../button/IconButton";
import { GlobalContext } from "@/context/GlobalContext";
import {
  firstPageIcon,
  lastPageIcon,
  leftIcon,
  rightIcon,
} from "@/components/ui/IconElement";
import { customProgressTheme, customTableTheme } from "@/helper/flowbiteTheme";
import { clsx } from "clsx";

export interface TableHeaderType {
  key: string;
  child: string | JSX.Element;
  class?: string;
}

export interface TableDataType {
  [key: string]: string | JSX.Element;
}

interface TableType {
  header: Array<TableHeaderType>;
  data: Array<TableDataType>;
  page: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  serverPagination: boolean;
}

function PaginationTable(props: TableType) {
  const [totalPages, setTotalPages] = useState(1);
  const [formatData, setFormatData] = useState<Array<Array<JSX.Element>>>([]);
  const { showLoading, tableLoading } = useContext(GlobalContext);

  // format table data
  const getTableData = (): Array<Array<JSX.Element>> => {
    const header = props.header;
    const data = props.data;

    if (header.length <= 0 || data.length <= 0) {
      return [];
    }

    const tableData: Array<Array<JSX.Element>> = [];
    let startRowIndex = 0;
    let endRowIndex = 0;
    if (props.serverPagination) {
      endRowIndex = props.data.length;
    } else {
      startRowIndex = (props.page - 1) * props.itemsPerPage;
      endRowIndex = props.page * props.itemsPerPage;

      if (endRowIndex > props.totalItems) {
        endRowIndex = props.totalItems;
      }
    }

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
            className={clsx(
              "whitespace-nowrap font-medium text-gray-500",
              header[k].class
            )}
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
  }, [
    props.header,
    props.data,
    props.serverPagination,
    totalPages,
    props.page,
  ]);

  return (
    <div> <div>{tableLoading}</div>
    <div className="overflow-x-auto">
      <div className="min-w-max">
       
        <Table theme={customTableTheme} hoverable>
          <Table.Head>
            {/* table header */}
            {props.header.map((header: TableHeaderType) => {
              return (
                <Table.HeadCell
                  key={`header_${header.key}`}
                  className={header.class}
                >
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
            {tableLoading ? (
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
            ) : props.data.length > 0 ? (
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
              {props.page} - {totalPages} of {props.totalItems}
            </div>
            <div className="flex align-center gap-2">
              {/* go to first page */}
              <IconButton
                disabled={
                  tableLoading ||
                  props.page === 1 ||
                  props.data.length === 0 ||
                  props.totalItems === 0 ||
                  showLoading
                }
                icon={firstPageIcon}
                plain={true}
                size="sm"
                color="gray"
                onClick={() => {
                  // notify the page changed
                  props.onPageChange(1);
                }}
              ></IconButton>

              {/* previous page */}
              <IconButton
                disabled={
                  tableLoading ||
                  props.page === 1 ||
                  props.data.length === 0 ||
                  props.totalItems === 0 ||
                  showLoading
                }
                icon={leftIcon}
                plain={true}
                size="sm"
                color="gray"
                onClick={() => {
                  // notify the page changed
                  props.onPageChange(props.page - 1);
                }}
              ></IconButton>

              {/* next page */}
              <IconButton
                disabled={
                  tableLoading ||
                  props.page === totalPages ||
                  props.data.length === 0 ||
                  props.totalItems === 0 ||
                  showLoading
                }
                icon={rightIcon}
                plain={true}
                size="sm"
                color="gray"
                onClick={() => {
                  // notify the page changed
                  props.onPageChange(props.page + 1);
                }}
              ></IconButton>

              {/* go to last page */}
              <IconButton
                disabled={
                  tableLoading ||
                  props.page === totalPages ||
                  props.data.length === 0 ||
                  props.totalItems === 0 ||
                  showLoading
                }
                icon={lastPageIcon}
                plain={true}
                size="sm"
                color="gray"
                onClick={() => {
                  // notify the page changed
                  props.onPageChange(totalPages);
                }}
              ></IconButton>
            </div>
          </div>
        </Card>
      </div>
    </div>
    </div>
  );
}

export default PaginationTable;
