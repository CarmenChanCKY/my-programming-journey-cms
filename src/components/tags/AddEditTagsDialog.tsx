import CustomDialog from "@/components/ui/CustomDialog";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import InputField from "@/components/ui/form/InputField";
import CustomButton from "@/components/ui/button/CustomButton";
import { useEffect } from "react";

interface AddEditTagsDialogInterface {
  openAddEditDialog: boolean;
  selectedID: number;
  editValue?: TagFormInterface;
  showLoading: boolean;
  callback: (
    type: "add" | "edit" | "close",
    formValue?: TagFormInterface
  ) => void;
}

export interface TagFormInterface {
  name: string;
}

function addEditDialogForm(props: AddEditTagsDialogInterface) {
  const addEditDialogForm = useForm<TagFormInterface>({
    mode: "onSubmit",
    defaultValues: {
      name: props.editValue?.name ?? "",
    },
  });

  const onAddEditDialogFormSubmit: SubmitHandler<TagFormInterface> = async (
    data: TagFormInterface
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
      title={props.selectedID === -1 ? "Add Tag" : "Edit Tag"}
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
            labelText="Tag Name"
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

export default addEditDialogForm;
