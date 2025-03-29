import PageHeader from "@/components/ui/PageHeader";
import PaginationTable, {
  TableHeaderType,
  TableDataType,
} from "@/components/ui/table/PaginationTable";
import { serverApi } from "@/helper/fetcher";
import { log } from "@/helper/common";
import { useContext, useEffect, useRef, useState } from "react";
import EditDeleteButton from "@/components/ui/table/EditDeleteButton";
import IconButton from "@/components/ui/button/IconButton";
import { addIcon } from "@/components/ui/IconElement";
import { GlobalContext } from "@/context/GlobalContext";
import SearchFilterLayout, {
  SearchFilterFormInterface,
} from "@/components/ui/form/SearchFilterLayout";
import { DropdownItemListInterface } from "@/components/ui/form/DropdownField";
import AddEditDialogForm, {
  TagFormInterface,
} from "@/components/tags/AddEditTagsDialog";
import DeleteDialog from "@/components/ui/DeleteDialog";

// for form
const header: Array<TableHeaderType> = [
  { key: "id", child: "ID" },
  { key: "name", child: "Name" },
  { key: "post_count", child: "Count" },
  { key: "actionEditDelete", child: "" },
];

const searchFilterList: Array<DropdownItemListInterface> = [
  { text: "All", value: "" },
  { text: "Count > 0", value: "used" },
  { text: "Count <= 0", value: "unused" },
];

let saveTableData: Array<any> = [];

function Tags() {
  const {
    showLoading,
    setLoading,
    tableLoading,
    setTableLoading,
    toastDispatch,
  } = useContext(GlobalContext);
  const [data, setData] = useState([] as Array<TableDataType>);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [saveSearchFilterFormValue, updateSearchFilterFormValue] = useState(
    null as null | SearchFilterFormInterface
  );
  const abortControllerRef = useRef(null as null | AbortController);

  // for AddEditDialogForm
  const [openAddEditDialog, setAddEditDialog] = useState(false);
  const [selectedID, setSelectedID] = useState(-1);
  const [updateValue, setUpdateValue] = useState({
    name: "",
  } as TagFormInterface);

  // for delete dialog
  const [openDeleteDialog, setDeleteDialog] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(-1);
  const removeItem =
    saveTableData.length <= 0 || deleteIndex === -1
      ? ""
      : saveTableData[deleteIndex].name;

  // for AddEditDialogForm
  const addButton: JSX.Element = (
    <IconButton
      icon={addIcon}
      disabled={tableLoading || showLoading}
      color="accent"
      onClick={(e) => {
        e.stopPropagation();

        if (!openAddEditDialog) {
          setSelectedID(-1);
          setAddEditDialog(true);
        }
      }}
    ></IconButton>
  );

  function onAddEditDialogConfirm(
    type: "add" | "edit" | "close",
    formValue?: TagFormInterface
  ) {
    if (type === "close") {
      // close the dialog directly
      setAddEditDialog(false);
    } else if (formValue !== undefined && formValue !== null) {
      if (type === "add") {
        // add new tag
        addTag(formValue.name);
      } else {
        // format existing tag
        updateTag(formValue.name);
      }
    }
  }

  // for delete dialog
  function onDeleteDialogConfirm(type: "confirm" | "close") {
    if (type === "close") {
      // close the dialog directly
      setDeleteDialog(false);
    } else {
      removeTag();
    }
  }

  // for table button
  function onPageChanged(page: number) {
    setCurrentPage(page);
    updateAbortControllerRef();
    getTagList(page, saveSearchFilterFormValue);
  }

  function onEditButtonClick(id: number, index: number) {
    if (!openAddEditDialog) {
      setSelectedID(id);
      setUpdateValue({ name: saveTableData[index].name });
      setAddEditDialog(true);
    }
  }

  function onRemoveButtonClick(id: number, index: number) {
    if (!openDeleteDialog) {
      setDeleteIndex(index);
      setDeleteDialog(true);
    }
  }

  // for search filter field
  function onSearchFilterValueUpdated(returnValue: SearchFilterFormInterface) {
    setCurrentPage(1);
    updateAbortControllerRef();
    updateSearchFilterFormValue(returnValue);
    getTagList(1, returnValue);
  }

  // for abort controller
  function updateAbortControllerRef() {
    if (abortControllerRef.current !== null) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
  }

  // db function
  async function getTagList(
    page: number,
    searchFilterFormValue: SearchFilterFormInterface | null
  ) {
    setTableLoading(true);
    setData([]);

    try {
      const payload: any = { pages: page };

      if (
        searchFilterFormValue !== undefined &&
        searchFilterFormValue !== null &&
        searchFilterFormValue.searchField !== ""
      ) {
        payload.filterName = searchFilterFormValue.searchField;
      }

      if (
        searchFilterFormValue !== undefined &&
        searchFilterFormValue !== null &&
        searchFilterFormValue.filterField !== ""
      ) {
        payload.filterUsedCount = searchFilterFormValue.filterField;
      }

      const result: any = await serverApi(
        "/tags",
        "get",
        payload,
        {},
        abortControllerRef.current?.signal
      );

      log("--- Get Tag List ---");
      log(result);

      if (Array.isArray(result)) {
        setData([]);
        setTotalItems(0);
        saveTableData = [];
      } else {
        saveTableData = result.data;
        setData(
          result.data.map((obj: any, index: number) => {
            return {
              ...obj,
              actionEditDelete: EditDeleteButton({
                editCallback: () => {
                  onEditButtonClick(result.data[index].id, index);
                },
                deleteCallback: () => {
                  onRemoveButtonClick(result.data[index].id, index);
                },
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

  async function addTag(name: string) {
    if (!showLoading) {
      setLoading(true);

      try {
        const result: any = await serverApi(
          "/tags/add",
          "post",
          {},
          { name: name }
        );

        log("--- Add Tag ---");
        log(result);

        setAddEditDialog(false);

        toastDispatch({
          actionType: "insert",
          text: "Add Tag Success",
          type: "success",
          onToastDismiss: () => {
            setLoading(false);
          },
        });
      } catch (error: any) {
        log("--- Add Tag Fail ---");
        log(error);

        let message = "Add Tag Fail";

        switch (error.description) {
          case "tag exists":
            message = "Tag already exists";
            break;
        }

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

  async function updateTag(name: string) {
    if (!showLoading) {
      setLoading(true);

      try {
        const result: any = await serverApi(
          "/tags/update",
          "post",
          {},
          { id: selectedID, name: name }
        );

        log("--- Edit Tag ---");
        log(result);

        toastDispatch({
          actionType: "insert",
          text: "Edit Tag Success",
          type: "success",
          onToastDismiss: () => {
            setLoading(false);
            setAddEditDialog(false);
            updateAbortControllerRef();

            // get tag list by page and limit
            getTagList(currentPage, saveSearchFilterFormValue);
          },
        });
      } catch (error: any) {
        log("--- Edit Tag Fail ---");
        log(error);

        let message = "Edit Tag Fail";

        switch (error.description) {
          case "tag exists":
            message = "Tag Name Exists";
            break;
        }

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

  async function removeTag() {
    if (!showLoading) {
      setLoading(true);

      try {
        const id = parseInt(saveTableData[deleteIndex].id, 10);
        const result: any = await serverApi(`/tags/delete`, "post", {}, { id });

        log("--- Remove Tag ---");
        log(result);

        toastDispatch({
          actionType: "insert",
          text: "Remove Tag Success",
          type: "success",
          onToastDismiss: () => {
            setLoading(false);
            setDeleteDialog(false);
            updateAbortControllerRef();

            // get tag list by page and limit
            getTagList(currentPage, saveSearchFilterFormValue);
          },
        });
      } catch (error: any) {
        log("--- Remove Tag Fail ---");
        log(error);

        let message = "Remove Tag Fail";

        switch (error.description) {
          case "tag not found":
            message = "Tag not found";
            break;
          case "tag has been used":
            message = "Tag has been used";
            break;
        }

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
    updateAbortControllerRef();
    // get tag list by page and limit
    getTagList(currentPage, saveSearchFilterFormValue);

    return () => {
      // cancel the previous request
      setTableLoading(false);
      if (abortControllerRef.current !== null) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <PageHeader rightComponent={addButton}></PageHeader>
      {/* table filter */}
      <SearchFilterLayout
        showSearchBar={true}
        searchBarPlaceholder="Search Tag Name"
        showFilter={true}
        filterItemList={searchFilterList}
        onSubmit={onSearchFilterValueUpdated}
      ></SearchFilterLayout>

      <PaginationTable
        header={header}
        data={data}
        page={currentPage}
        totalItems={totalItems}
        itemsPerPage={10}
        onPageChange={onPageChanged}
        serverPagination={true}
      ></PaginationTable>

      {/* for add / edit tag dialog */}
      <AddEditDialogForm
        openAddEditDialog={openAddEditDialog}
        selectedID={selectedID}
        showLoading={showLoading || tableLoading}
        editValue={updateValue}
        callback={onAddEditDialogConfirm}
      ></AddEditDialogForm>

      {/* for delete tag dialog */}
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        removeItem={removeItem}
        showLoading={showLoading || tableLoading}
        callback={onDeleteDialogConfirm}
      ></DeleteDialog>
    </>
  );
}

export default Tags;
