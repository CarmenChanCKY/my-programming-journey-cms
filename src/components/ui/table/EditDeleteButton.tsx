import IconButton from "@/components/ui/button/IconButton";
import { editIcon, deleteIcon } from "@/components/ui/IconElement";

function EditDeleteButton({
  editCallback,
  deleteCallback,
}: {
  editCallback: () => void;
  deleteCallback: () => void;
}) {
  return (
    <div className="flex justify-center space-x-4">
      <IconButton
        icon={editIcon}
        plain
        color="success"
        onClick={(e: any) => {
          e.stopPropagation();
          editCallback();
        }}
      ></IconButton>
      <IconButton
        icon={deleteIcon}
        plain
        color="error"
        onClick={(e: any) => {
          e.stopPropagation();
          deleteCallback();
        }}
      ></IconButton>
    </div>
  );
}

export default EditDeleteButton;
