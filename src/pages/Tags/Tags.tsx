import PaginationTable from "@/components/ui/table/PaginationTable";

function Tags() {
  const header = [
    { key: "name", child: "Name" },
    { key: "gender", child: "Gender" },
  ];
  const data = [{ name: "Happy", gender: "Test" }];

  return (
    <PaginationTable
      header={header}
      data={data}
      loading={false}
      page={0}
      totalItems={0}
      itemsPerPage={0}
      onPageChange={() => {}}
      serverPagination={false}
    ></PaginationTable>
  );
}

export default Tags;
