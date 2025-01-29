import PageHeader from "@/components/ui/PageHeader";
import PaginationTable, {
  TableHeaderType,
  TableDataType,
} from "@/components/ui/table/PaginationTable";
import { getAPI } from "@/helper/fetcher";
import { log } from "@/helper/common";
import { useEffect, useState } from "react";
import EditDeleteButton from "@/components/ui/table/EditDeleteButton";

function Tags() {
  const header: Array<TableHeaderType> = [
    { key: "id", child: "ID" },
    { key: "name", child: "Name" },
    { key: "post_count", child: "Count" },
    { key: "actionEditDelete", child: "" },
  ];

  const [data, setData] = useState([] as Array<TableDataType>);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [tableLoading, setTableLoading] = useState(false);

  async function getTagList(cancelSignal: AbortController) {
    setTableLoading(true);
    setData([]);
    try {
      const result: any = await getAPI(
        "/tags/list",
        { pages: currentPage },
        cancelSignal.signal
      );

      log("--- Get Tag List ---");
      log(result);

      if (Array.isArray(result)) {
        setData([]);
        setTotalItems(0);
      } else {
        setData(
          result.data.map((obj: any, index: number) => {
            return {
              ...obj,
              actionEditDelete: EditDeleteButton({
                editCallback: () => {
                  console.log(index);
                },
                deleteCallback: () => {},
              }),
            };
          })
        );
        setTotalItems(result.total);
      }
    } catch (error: any) {
      log("--- Get Tag List error ---");
      log(error);

      setData([]);
      setTotalItems(0);
    } finally {
      setTableLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    // get tag list by page and limit
    getTagList(controller);

    return () => {
      // cancel the previous request
      setTableLoading(false);
      controller.abort();
    };
  }, [currentPage]);

  return (
    <>
      <PageHeader></PageHeader>
      <PaginationTable
        header={header}
        data={data}
        loading={tableLoading}
        initialPage={1}
        totalItems={totalItems}
        itemsPerPage={10}
        onPageChange={(page: number) => {
          setCurrentPage(page);
        }}
        serverPagination={true}
      ></PaginationTable>
    </>
  );
}

export default Tags;
