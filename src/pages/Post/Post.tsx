import IconButton from "@/components/ui/button/IconButton";
import DeleteDialog from "@/components/ui/dialog/DeleteDialog";
import { DropdownItemListInterface } from "@/components/ui/form/DropdownField";
import SearchPostLayout, {
  PostSearchResultInterface,
} from "@/components/ui/form/SearchPostLayout";
import { addIcon } from "@/components/ui/IconElement";
import PageHeader from "@/components/ui/PageHeader";
import EditDeleteButton from "@/components/ui/table/EditDeleteButton";
import PaginationTable, {
  TableDataType,
  TableHeaderType,
} from "@/components/ui/table/PaginationTable";
import { GlobalContext } from "@/context/GlobalContext";
import { log } from "@/helper/common";
import { serverApi } from "@/helper/fetcher";
import { generateRoutePath } from "@/router/route";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";

// for form
const header: Array<TableHeaderType> = [
  { key: "id", child: "ID" },
  { key: "date", child: "Date" },
  {
    key: "title",
    child: "Title",
    class: "table-w-limit min-w-[200px] max-w-[450px]",
  },
  { key: "category", child: "Category" },
  {
    key: "tags",
    child: "Tags",
    class: "table-w-limit min-w-[150px] max-w-[350px]",
  },
  { key: "actionEditDelete", child: "" },
];

function Post() {
  const {
    showLoading,
    setLoading,
    tableLoading,
    setTableLoading,
    toastDispatch,
  } = useContext(GlobalContext);
  const navigate = useNavigate();

  const [data, setData] = useState<Array<TableDataType>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // for delete dialog
  const [openDeleteDialog, setDeleteDialog] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(-1);
  const removeItem =
    data.length <= 0 || deleteIndex === -1
      ? ""
      : data[deleteIndex].title.toString();

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

  // for delete dialog
  function onRemoveButtonClick(index: number) {
    if (!openDeleteDialog) {
      setDeleteIndex(index);
      setDeleteDialog(true);
    }
  }

  function onDeleteDialogConfirm(type: "confirm" | "close") {
    if (type === "close") {
      // close the dialog directly
      setDeleteDialog(false);
    } else {
      removePost();
    }
  }

  // for search filter field
  function onSearchFilterValueUpdated(returnValue: PostSearchResultInterface) {
    updateAbortControllerRef("post");
    setCurrentPage(1);
    updateSearchFormValue(returnValue);
    getPostList(1, returnValue);
  }

  function onSearchFilterReset() {
    if (saveSearchFormValue !== null) {
      updateAbortControllerRef("post");
      setCurrentPage(1);
      updateSearchFormValue(null);
      getPostList(1, null);
    }
  }

  // for table button
  function onPageChanged(page: number) {
    setCurrentPage(page);
    updateAbortControllerRef("post");
    getPostList(page, saveSearchFormValue);
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
  async function getPostList(
    page: number,
    searchFilterFormValue: PostSearchResultInterface | null
  ) {
    setTableLoading(true);
    setData([]);

    try {
      const payload: any = { pages: page };

      if (
        searchFilterFormValue !== undefined &&
        searchFilterFormValue !== null
      ) {
        if (searchFilterFormValue.postTitle !== "") {
          payload.postTitle = searchFilterFormValue.postTitle;
        }

        if (searchFilterFormValue.categoryID !== -1) {
          payload.categoryID = searchFilterFormValue.categoryID;
        }

        if (searchFilterFormValue.tagsIDList.length > 0) {
          payload.tagsID = searchFilterFormValue.tagsIDList;
        }
      }

      const result: any = await serverApi(
        "/post",
        "get",
        payload,
        {},
        getAbortController("post")
      );

      log("--- Get Post List ---");
      log(result);

      if (Array.isArray(result)) {
        setData([]);
        setTotalItems(0);
      } else {
        setData(
          result.data.map((obj: any, index: number) => {
            return {
              id: obj.id,
              date: obj.date,
              title: obj.title,
              category: obj.category_name,
              tags: obj.tags_data.join(", "),
              actionEditDelete: EditDeleteButton({
                editCallback: () => {
                  navigate(generateRoutePath(`/post/detail/${obj.id}`));
                },
                deleteCallback: () => {
                  onRemoveButtonClick(index);
                },
              }),
            };
          })
        );
        setTotalItems(result.total);
      }
    } catch (error) {
      log("--- Get Post List error ---");
      log(error);

      setData([]);
      setTotalItems(0);
    } finally {
      setTableLoading(false);
    }
  }

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
        "/tags/filter-tags-list",
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

  async function removePost() {
    if (!showLoading) {
      setLoading(true);

      try {
        const id = parseInt(data[deleteIndex].id.toString(), 10);
        const result: any = await serverApi(`/post/delete`, "post", {}, { id });

        log("--- Remove Post ---");
        log(result);

        toastDispatch({
          actionType: "insert",
          text: "Remove Post Success",
          type: "success",
          onToastDismiss: () => {
            setLoading(false);
            setDeleteDialog(false);
            navigate(0);
          },
        });
      } catch (error: any) {
        log("--- Remove Post Fail ---");
        log(error);

        const message = "Remove Post Fail";

        toastDispatch({
          actionType: "insert",
          text: message,
          type: "error",
          onToastDismiss: () => {
            setLoading(false);
          },
        });
      }
    }
  }

  useEffect(() => {
    // get tag list
    getTagList();
    // get category list
    getCategoryList();

    // get post
    getPostList(currentPage, saveSearchFormValue);

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
        onReset={onSearchFilterReset}
      ></SearchPostLayout>

      <PaginationTable
        header={header}
        data={data}
        page={currentPage}
        totalItems={totalItems}
        itemsPerPage={10}
        onPageChange={onPageChanged}
        serverPagination={true}
      ></PaginationTable>

      {/* for delete post dialog */}
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        title={"Post"}
        removeItem={removeItem}
        showLoading={showLoading || tableLoading}
        callback={onDeleteDialogConfirm}
      ></DeleteDialog>
    </>
  );
}

export default Post;
