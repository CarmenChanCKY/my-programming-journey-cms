import IconButton from "@/components/ui/button/IconButton";
import { DropdownItemListInterface } from "@/components/ui/form/DropdownField";
import SearchPostLayout, {
  PostSearchResultInterface,
} from "@/components/ui/form/SearchPostLayout";
import { addIcon } from "@/components/ui/IconElement";
import PageHeader from "@/components/ui/PageHeader";
import {
  TableDataType,
  TableHeaderType,
} from "@/components/ui/table/PaginationTable";
import { GlobalContext } from "@/context/GlobalContext";
import { log } from "@/helper/common";
import { serverApi } from "@/helper/fetcher";
import { generateRoutePath } from "@/router/route";
import { useContext, useEffect, useRef, useState } from "react";
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

  const abortControllerRef = useRef<Map<string, AbortController>>(new Map());

  // for filter
  const [categoryList, setCategoryList] = useState<
    Array<DropdownItemListInterface>
  >([]);
  const [tagsList, setTagsList] = useState<Array<DropdownItemListInterface>>(
    []
  );
  const [saveSearchFormValue, updateSearchFormValue] =
    useState<PostSearchResultInterface | null>(null);

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

  // for search filter field
  function onSearchFilterValueUpdated(returnValue: PostSearchResultInterface) {
    console.log(returnValue)
  }

  // for abort controller
  function updateAbortControllerRef(
    key: "post" | "tag" | "category",
    reset: boolean = true
  ) {
    if (
      abortControllerRef.current !== null &&
      abortControllerRef.current.has(key)
    ) {
      abortControllerRef.current.get(key)?.abort();
      abortControllerRef.current.delete(key);
    }

    if (reset) {
      abortControllerRef.current.set(key, new AbortController());
    }
  }

  function getAbortController(key: "post" | "tag" | "category") {
    return abortControllerRef.current.get(key)?.signal;
  }

  // db function
  async function getCategoryList() {
    try {
      updateAbortControllerRef("category");

      const result: any = await serverApi(
        "/categories/filter-category-list",
        "get",
        {},
        {},
        getAbortController("category")
      );

      log("--- Get Filter Category List ---");
      log(result);

      if (Array.isArray(result)) {
        setCategoryList([]);
      } else {
        setCategoryList(
          result.data.map((obj: any) => {
            return { text: obj.name, value: obj.id };
          })
        );
      }
    } catch (error: any) {
      log("--- Get Filter Category List error ---");
      log(error);
    }
  }

  async function getTagList() {
    try {
      updateAbortControllerRef("tag");

      const result: any = await serverApi(
        "/tags//filter-tags-list",
        "get",
        {},
        {},
        getAbortController("tag")
      );

      log("--- Get Filter Tag List ---");
      log(result);

      if (Array.isArray(result)) {
        setTagsList([]);
      } else {
        setTagsList(
          result.data.map((obj: any) => {
            return { text: obj.name, value: obj.id };
          })
        );
      }
    } catch (error: any) {
      log("--- Get Filter Tag List error ---");
      log(error);
    }
  }

  useEffect(() => {
    // get tag list
    getTagList();
    // get category list
    getCategoryList();

    // get post
    return () => {
      // cancel the previous request
      setTableLoading(false);
      updateAbortControllerRef("post", false);
      updateAbortControllerRef("tag", false);
      updateAbortControllerRef("category", false);
    };
  }, []);

  return (
    <>
      <PageHeader rightComponent={addButton()}></PageHeader>
      {/* table filter */}
      <SearchPostLayout
        categoryItemList={categoryList}
        tagsItemList={tagsList}
        onSubmit={onSearchFilterValueUpdated}
      ></SearchPostLayout>
      <div>tests</div>
    </>
  );
}

export default Post;
