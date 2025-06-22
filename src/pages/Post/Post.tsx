import IconButton from "@/components/ui/button/IconButton";
import { PostSearchResultInterface } from "@/components/ui/form/SearchPostLayout";
import { addIcon } from "@/components/ui/IconElement";
import PageHeader from "@/components/ui/PageHeader";
import {
  TableDataType,
  TableHeaderType,
} from "@/components/ui/table/PaginationTable";
import { GlobalContext } from "@/context/GlobalContext";
import { generateRoutePath } from "@/router/route";
import { useContext, useRef, useState } from "react";
import { Link } from "react-router";

// for form
const header: Array<TableHeaderType> = [
  { key: "id", child: "ID" },
  { key: "date", child: "Date" },
  { key: "title", child: "Title" },
  { key: "category", child: "Category" },
  { key: "tags", child: "Tags" },
  { key: "slug", child: "Slug" },
  { key: "actionEditDelete", child: "" },
];

function Post() {
  const { showLoading, setLoading, tableLoading, setTableLoading } =
    useContext(GlobalContext);
  const [data, setData] = useState<Array<TableDataType>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [saveSearchFormValue, updateSearchFormValue] =
    useState<PostSearchResultInterface | null>(null);
  const abortControllerRef = useRef<Set<AbortController>>(new Set());

  const addButton = () => {
    return (
      <Link to={generateRoutePath("/post/add")}>
        <IconButton
          icon={addIcon}
          disabled={tableLoading || showLoading}
          color="accent"
        ></IconButton>
      </Link>
    );
  };

  return (
    <>
      <PageHeader rightComponent={addButton()}></PageHeader>
      <div>tests</div>
    </>
  );
}

export default Post;
