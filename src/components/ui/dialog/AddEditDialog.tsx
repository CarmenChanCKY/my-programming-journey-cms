import CustomDialog from "@/components/ui/dialog/CustomDialog";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import InputField from "@/components/ui/form/InputField";
import CustomButton from "@/components/ui/button/CustomButton";
import { useEffect } from "react";

interface AddEditDialogInterface {
  openAddEditDialog: boolean;
  title: string;
  selectedID: number;
  editValue?: AddEditFormInterface;
  showLoading: boolean;
  callback: (
    type: "add" | "edit" | "close",
    formValue?: AddEditFormInterface
  ) => void;
}

export interface AddEditFormInterface {
  name: string;
}

function AddEditDialogForm(props: AddEditDialogInterface) {
  const addEditDialogForm = useForm<AddEditFormInterface>({
    mode: "onSubmit",
    defaultValues: {
      name: props.editValue?.name ?? "",
    },
  });

  const onAddEditDialogFormSubmit: SubmitHandler<AddEditFormInterface> = async (
    data: AddEditFormInterface
  ) => {
    if (props.selectedID === -1) {
      props.callback("add", data);
    } else {
      props.callback("edit", data);
    }
  };

  useEffect(() => {
    if (props.openAddEditDialog) {
      addEditDialogForm.reset();
    }

    if (
      props.editValue?.name !== undefined &&
      props.editValue?.name !== null &&
      props.editValue?.name !== ""
    ) {
      addEditDialogForm.setValue("name", props.editValue?.name);
    }
  }, [props.openAddEditDialog]);

  return (
    <CustomDialog
      open={props.openAddEditDialog}
      title={props.title}
      onClose={() => {
        if (!props.showLoading) {
          props.callback("close");
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
            labelText="Name"
            disabled={props.showLoading}
          ></InputField>

          <CustomButton
            className="mt-6"
            text="Confirm"
            type="submit"
            disabled={props.showLoading}
          ></CustomButton>
        </form>
      </FormProvider>
    </CustomDialog>
  );
}

export default AddEditDialogForm;
