import PageHeader from "@/components/ui/PageHeader";
import PaginationTable, {
  TableHeaderType,
  TableDataType,
} from "@/components/ui/table/PaginationTable";
import { useEffect, useState } from "react";

function Tags() {
  const header: Array<TableHeaderType> = [
    { key: "name", child: "Name" },
    { key: "gender", child: "Gender" },
  ];

  const [data, setData] = useState([] as Array<TableDataType>);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {}, [currentPage]);

  return (
    <>
      <PageHeader></PageHeader>
      <PaginationTable
        header={header}
        data={data}
        loading={false}
        initialPage={1}
        totalItems={totalItems}
        itemsPerPage={10}
        onPageChange={(page: number) => {
          setCurrentPage(page);
        }}
        serverPagination={false}
      ></PaginationTable>
    </>
  );
}

export default Tags;
