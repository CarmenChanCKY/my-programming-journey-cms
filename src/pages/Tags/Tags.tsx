import PageHeader from "@/components/ui/PageHeader";
import PaginationTable, {
  TableHeaderType,
  TableDataType,
} from "@/components/ui/table/PaginationTable";
import { serverApi } from "@/helper/fetcher";
import { log } from "@/helper/common";
import { useContext, useEffect, useState } from "react";
import EditDeleteButton from "@/components/ui/table/EditDeleteButton";
import IconButton from "@/components/ui/button/IconButton";
import { addIcon } from "@/components/ui/IconElement";
import { GlobalContext } from "@/context/GlobalContext";
import CustomDialog from "@/components/ui/CustomDialog";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import InputField from "@/components/ui/form/InputField";
import CustomButton from "@/components/ui/button/CustomButton";
import { defaultColor } from "@/helper/color";
import { useNavigate } from "react-router-dom";
import { generateRoutePath } from "@/router/route";

function Tags() {
  const header: Array<TableHeaderType> = [
    { key: "id", child: "ID" },
    { key: "name", child: "Name" },
    { key: "post_count", child: "Count" },
    { key: "actionEditDelete", child: "" },
  ];

  const { showLoading, setLoading, toastDispatch } = useContext(GlobalContext);
  const [data, setData] = useState([] as Array<TableDataType>);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [tableLoading, setTableLoading] = useState(false);
  const [openAddEditDialog, setAddEditDialog] = useState(false);
  const [selectedID, setSelectedID] = useState(-1);
  const navigate = useNavigate();

  // for form
  interface TagFormInterface {
    name: string;
  }

  const addEditDialogForm = useForm<TagFormInterface>({
    mode: "onSubmit",
    defaultValues: {
      name: "",
    },
  });

  const addButton: JSX.Element = (
    <IconButton
      icon={addIcon}
      outlined
      disabled={tableLoading || showLoading}
      onClick={(e) => {
        e.stopPropagation();

        if (!openAddEditDialog) {
          addEditDialogForm.reset();
          setSelectedID(-1);
          setAddEditDialog(true);
        }
      }}
    ></IconButton>
  );

  const onAddEditDialogFormSubmit: SubmitHandler<TagFormInterface> = async (
    data: TagFormInterface
  ) => {
    if (selectedID === -1) {
      addTag(data.name);
    } else {
      updateTag(data.name);
    }
  };

  // db function
  async function getTagList(cancelSignal: AbortController) {
    setTableLoading(true);
    setData([]);
    try {
      const result: any = await serverApi(
        "/tags",
        "get",
        { pages: currentPage },
        {},
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

  async function addTag(name: string) {
    if (!showLoading) {
      setLoading(true);

      try {
        const result: any = await serverApi(
          "/tags",
          "post",
          {},
          { name: name }
        );

        log("--- Add Tag ---");
        log(result);

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

  async function updateTag(name: string) {}

  async function removeTag() {}

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
      <PageHeader rightComponent={addButton}></PageHeader>
      {/* TODO: add filter */}
      <PaginationTable
        header={header}
        data={data}
        loading={tableLoading}
        page={currentPage}
        totalItems={totalItems}
        itemsPerPage={10}
        onPageChange={(page: number) => {
          setCurrentPage(page);
        }}
        serverPagination={true}
      ></PaginationTable>

      {/* for add / edit tag dialog */}
      <CustomDialog
        open={openAddEditDialog}
        title={selectedID === -1 ? "Add Tag" : "Edit Tag"}
        onClose={() => {
          if (!showLoading) {
            setAddEditDialog(false);
          }
        }}
      >
        <FormProvider {...addEditDialogForm}>
          <form
            onSubmit={addEditDialogForm.handleSubmit(onAddEditDialogFormSubmit)}
            noValidate
            autoComplete="off"
          >
            <InputField
              id="name"
              name="name"
              required={true}
              labelText="Tag Name"
            ></InputField>

            <CustomButton
              className="mt-6"
              text="Confirm"
              bgColor={defaultColor.success["DEFAULT"]}
              textColor="#ffffff"
              type="submit"
              disabled={showLoading}
              paddingLeft={16}
              paddingRight={16}
            ></CustomButton>
          </form>
        </FormProvider>
      </CustomDialog>
    </>
  );
}

export default Tags;
