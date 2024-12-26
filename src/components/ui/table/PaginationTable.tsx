import { Table } from "flowbite-react";

interface TableHeaderType {
  key: string;
  child: string | JSX.Element;
}

interface TableDataType {
  [key: string]: string | JSX.Element;
}

interface TableType {
  header: Array<TableHeaderType>;
  data: Array<TableDataType>;
  loading: boolean;
  page: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  serverPagination: boolean;
}

const getTableData = (header: Array<TableHeaderType>, data: TableDataType) => {
  const tableData = [];

  const dataKey = Object.keys(data);
  for (let i = 0; i < header.length; i++) {
    let element: JSX.Element | string = <span></span>;

    if (dataKey.includes(header[i].key)) {
      if (typeof data[header[i].key] === "string") {
        element = <span>{data[header[i].key]}</span>;
      } else {
        element = data[header[i].key];
      }
    }

    tableData.push(
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900">
        {element}
      </Table.Cell>
    );
  }

  return tableData;
};

function PaginationTable(props: TableType) {
  return (
    <div className="overflow-x-auto">
      <Table hoverable>
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
          {props.data.map((data: TableDataType, index: number) => {
            return (
              <Table.Row key={`data_${index}`}>
                {getTableData(props.header, data)}
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
}

export default PaginationTable;
