import IconButton from "@/components/ui/button/IconButton";
import { editIcon, deleteIcon } from "@/components/ui/IconElement";
import { defaultColor } from "@/helper/color";

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
        bgColor={defaultColor.success[800]}
        iconColor={defaultColor.success["DEFAULT"]}
        onClick={(e: any) => {
          e.stopPropagation();
          editCallback();
        }}
      ></IconButton>
      <IconButton
        icon={deleteIcon}
        plain
        bgColor={defaultColor.error[800]}
        iconColor={defaultColor.error["DEFAULT"]}
        onClick={(e: any) => {
          e.stopPropagation();
          deleteCallback();
        }}
      ></IconButton>
    </div>
  );
}

export default EditDeleteButton;
