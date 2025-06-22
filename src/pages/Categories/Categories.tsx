import { useContext, useEffect, useRef, useState } from "react";
import { DropdownItemListInterface } from "@/components/ui/form/DropdownField";
import SearchFilterLayout, {
  SearchFilterFormInterface,
} from "@/components/ui/form/SearchFilterLayout";
import PaginationTable, {
  TableDataType,
  TableHeaderType,
} from "@/components/ui/table/PaginationTable";
import { GlobalContext } from "@/context/GlobalContext";
import IconButton from "@/components/ui/button/IconButton";
import AddEditDialogForm, {
  AddEditFormInterface,
} from "@/components/ui/dialog/AddEditDialog";
import DeleteDialog from "@/components/ui/dialog/DeleteDialog";
import { addIcon } from "@/components/ui/IconElement";
import PageHeader from "@/components/ui/PageHeader";
import EditDeleteButton from "@/components/ui/table/EditDeleteButton";
import { serverApi } from "@/helper/fetcher";
import { log } from "@/helper/common";

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

function Categories() {
  const {
    showLoading,
    setLoading,
    tableLoading,
    setTableLoading,
    toastDispatch,
  } = useContext(GlobalContext);
  const [data, setData] = useState<Array<TableDataType>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [saveSearchFilterFormValue, updateSearchFilterFormValue] =
    useState<SearchFilterFormInterface | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // for AddEditDialogForm
  const [openAddEditDialog, setAddEditDialog] = useState(false);
  const [selectedID, setSelectedID] = useState(-1);
  const [updateValue, setUpdateValue] = useState<AddEditFormInterface>({
    name: "",
  });
  const addEditDialogTitle =
    selectedID === -1 ? "Add Category" : "Edit Category";

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
          setUpdateValue({ name: "" });
          setAddEditDialog(true);
        }
      }}
    ></IconButton>
  );

  function onAddEditDialogConfirm(
    type: "add" | "edit" | "close",
    formValue?: AddEditFormInterface
  ) {
    if (type === "close") {
      // close the dialog directly
      setAddEditDialog(false);
    } else if (formValue !== undefined && formValue !== null) {
      if (type === "add") {
        // add new category
        addCategory(formValue.name);
      } else {
        // format existing category
        updateCategory(formValue.name);
      }
    }
  }

  // for delete dialog
  function onDeleteDialogConfirm(type: "confirm" | "close") {
    if (type === "close") {
      // close the dialog directly
      setDeleteDialog(false);
    } else {
      removeCategory();
    }
  }

  // for table button
  function onPageChanged(page: number) {
    setCurrentPage(page);
    updateAbortControllerRef();
    getCategoryList(page, saveSearchFilterFormValue);
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
    getCategoryList(1, returnValue);
  }

  // for abort controller
  function updateAbortControllerRef() {
    if (abortControllerRef.current !== null) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
  }

  // db function
  async function getCategoryList(
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
        "/categories",
        "get",
        payload,
        {},
        abortControllerRef.current?.signal
      );

      log("--- Get Category List ---");
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
      log("--- Get Category List error ---");
      log(error);

      setData([]);
      setTotalItems(0);
    } finally {
      setTableLoading(false);
    }
  }

  async function addCategory(name: string) {
    if (!showLoading) {
      setLoading(true);

      try {
        const result: any = await serverApi(
          "/categories/add",
          "post",
          {},
          { name: name }
        );

        log("--- Add Category ---");
        log(result);

        setAddEditDialog(false);
        setLoading(false);

        toastDispatch({
          actionType: "insert",
          text: "Add Category Success",
          type: "success",
        });
      } catch (error: any) {
        log("--- Add Category Fail ---");
        log(error);

        let message = "Add Category Fail";

        switch (error.description) {
          case "category exists":
            message = "Category already exists";
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

  async function updateCategory(name: string) {
    if (!showLoading) {
      setLoading(true);

      try {
        const result: any = await serverApi(
          "/categories/update",
          "post",
          {},
          { id: selectedID, name: name }
        );

        log("--- Edit Category ---");
        log(result);

        toastDispatch({
          actionType: "insert",
          text: "Edit Category Success",
          type: "success",
          onToastDismiss: () => {
            setLoading(false);
            setAddEditDialog(false);
            updateAbortControllerRef();

            // get category list by page and limit
            getCategoryList(currentPage, saveSearchFilterFormValue);
          },
        });
      } catch (error: any) {
        log("--- Edit Category Fail ---");
        log(error);

        let message = "Edit Category Fail";

        switch (error.description) {
          case "category exists":
            message = "Category Name Exists";
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

  async function removeCategory() {
    if (!showLoading) {
      setLoading(true);

      try {
        const id = parseInt(saveTableData[deleteIndex].id, 10);
        const result: any = await serverApi(
          `/categories/delete`,
          "post",
          {},
          { id }
        );

        log("--- Remove Category ---");
        log(result);

        toastDispatch({
          actionType: "insert",
          text: "Remove Category Success",
          type: "success",
          onToastDismiss: () => {
            setLoading(false);
            setDeleteDialog(false);
            updateAbortControllerRef();

            // get category list by page and limit
            getCategoryList(currentPage, saveSearchFilterFormValue);
          },
        });
      } catch (error: any) {
        log("--- Remove Category Fail ---");
        log(error);

        let message = "Remove Category Fail";

        switch (error.description) {
          case "category not found":
            message = "Category not found";
            break;
          case "category has been used":
            message = "Category has been used";
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
    // get category list by page and limit
    getCategoryList(currentPage, saveSearchFilterFormValue);

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
        searchBarPlaceholder="Search Category Name"
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

      {/* for add / edit category dialog */}
      <AddEditDialogForm
        openAddEditDialog={openAddEditDialog}
        title={addEditDialogTitle}
        selectedID={selectedID}
        showLoading={showLoading || tableLoading}
        editValue={updateValue}
        callback={onAddEditDialogConfirm}
      ></AddEditDialogForm>

      {/* for delete category dialog */}
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        removeItem={removeItem}
        showLoading={showLoading || tableLoading}
        callback={onDeleteDialogConfirm}
      ></DeleteDialog>
    </>
  );
}

export default Categories;
