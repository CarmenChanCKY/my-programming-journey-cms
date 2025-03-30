import CustomButton from "@/components/ui/button/CustomButton";
import CustomDialog from "@/components/ui/dialog/CustomDialog";

interface DeleteDialogInterface {
  openDeleteDialog: boolean;
  removeItem: string;
  showLoading: boolean;
  callback: (type: "confirm" | "close") => void;
}

function DeleteDialog(props: DeleteDialogInterface) {
  return (
    <CustomDialog
      open={props.openDeleteDialog}
      title={`Delete ${props.removeItem}`}
      onClose={() => {
        if (!props.showLoading) {
          props.callback("close");
        }
      }}
    >
      <>
        <div className="mb-5">Do you want to remove {props.removeItem}?</div>
        <div className="flex justify-end gap-4">
          <CustomButton
            text="Cancel"
            disabled={props.showLoading}
            color="error"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              props.callback("close");
            }}
          ></CustomButton>
          <CustomButton
            text="Confirm"
            disabled={props.showLoading}
            color="success"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              props.callback("confirm");
            }}
          ></CustomButton>
        </div>
      </>
    </CustomDialog>
  );
}

export default DeleteDialog;
