import CustomDialog from "@/components/ui/dialog/CustomDialog";
import { useEffect } from "react";
import CustomButton from "@/components/ui/button/CustomButton";
import { CustomFlowbiteTheme } from "flowbite-react";
import GridContainer from "@/components/ui/grid_system/GridContainer";
import GridRow from "@/components/ui/grid_system/GridRow";
import GridColumn from "@/components/ui/grid_system/GridColumn";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import InputField from "@/components/ui/form/InputField";
import CheckboxField from "@/components/ui/form/CheckboxField";

interface InsertTableDialogInterface {
  openDialog: boolean;
  showLoading: boolean;
  callback: (
    type: "confirm" | "close",
    row?: number,
    column?: number,
    includeHeading?: boolean
  ) => void;
}

interface InsertTableFormInterface {
  selectRow: number;
  selectColumn: number;
  header: boolean;
}

const insertTableDialogTheme: CustomFlowbiteTheme["modal"] = {
  body: {
    base: "flex-1 overflow-auto px-3 py-2",
  },
  content: {
    base: "relative p-4 md:h-auto",
  },
  header: {
    base: "flex items-start justify-between rounded-t border-b px-3 py-2",
    close: {
      base: "ml-auto inline-flex items-center rounded-lg bg-transparent p-1 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900",
    },
  },
};

function InsertTableDialog(props: InsertTableDialogInterface) {
  const insertTableForm = useForm<InsertTableFormInterface>({
    mode: "onSubmit",
    defaultValues: {
      selectRow: 1,
      selectColumn: 1,
      header: false,
    },
  });

  const onInsertTableFormSubmit: SubmitHandler<
    InsertTableFormInterface
  > = async (data: InsertTableFormInterface) => {
    const row = data.selectRow <= 0 ? 1 : data.selectRow;
    const col = data.selectColumn <= 0 ? 1 : data.selectColumn;
    props.callback(
      "confirm",
      parseInt(row.toString()),
      parseInt(col.toString()),
      data.header
    );
  };

  useEffect(() => {
    if (props.openDialog) {
      insertTableForm.reset();
    }
  }, [props.openDialog]);

  return (
    <CustomDialog
      open={props.openDialog}
      modalTheme={insertTableDialogTheme}
      onClose={() => {
        if (!props.showLoading) {
          props.callback("close");
        }
      }}
    >
      <FormProvider {...insertTableForm}>
        <form
          onSubmit={insertTableForm.handleSubmit(onInsertTableFormSubmit)}
          noValidate
          autoComplete="off"
        >
          <GridContainer>
            <GridRow>
              <GridColumn cols={12}>
                <CheckboxField
                  id="header"
                  name="header"
                  labelText="First Row as Header"
                ></CheckboxField>
              </GridColumn>
            </GridRow>
            <GridRow>
              <GridColumn xl={6} lg={6} md={6} sm={6} xs={12} cols={12}>
                <InputField
                  id="selectRow"
                  name="selectRow"
                  required={true}
                  validateNumber={true}
                  inputNumberOnly={true}
                  labelText="Row"
                  disabled={props.showLoading}
                ></InputField>
              </GridColumn>
              <GridColumn xl={6} lg={6} md={6} sm={6} xs={12} cols={12}>
                <InputField
                  id="selectColumn"
                  name="selectColumn"
                  required={true}
                  validateNumber={true}
                  inputNumberOnly={true}
                  labelText="Column"
                  disabled={props.showLoading}
                ></InputField>
              </GridColumn>
            </GridRow>
            <GridRow>
              <GridColumn cols={12}>
                <CustomButton
                  className="mt-6"
                  text="Confirm"
                  type="button"
                  disabled={props.showLoading}
                  onClick={() => insertTableForm.handleSubmit(onInsertTableFormSubmit)()}
                ></CustomButton>
              </GridColumn>
            </GridRow>
          </GridContainer>
        </form>
      </FormProvider>
    </CustomDialog>
  );
}

export default InsertTableDialog;
