import CustomDialog from "@/components/ui/dialog/CustomDialog";
import { Sketch } from "@uiw/react-color";
import { CustomFlowbiteTheme } from "flowbite-react";
import { useState } from "react";
import CustomButton from "@/components/ui/button/CustomButton";

interface EditorColorPickerInterface {
  openDialog: boolean;
  showLoading: boolean;
  currentColor: string;
  callback: (type: "update" | "clear" | "close", color?: string) => void;
}

const colorPickerDialogTheme: CustomFlowbiteTheme["modal"] = {
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

function EditorColorPicker(props: EditorColorPickerInterface) {
  const [pickerColor, setPickerColor] = useState(props.currentColor);

  return (
    <CustomDialog
      open={props.openDialog}
      modalTheme={colorPickerDialogTheme}
      onClose={() => {
        if (!props.showLoading) {
          props.callback("close");
        }
      }}
    >
      <>
        <Sketch
          style={{ boxShadow: "unset" }}
          color={pickerColor}
          presetColors={["#3d5a80", "#98c1d9", "#f7d4bc", "#4caf50", "#ff5252"]}
          onChange={(color) => {
            setPickerColor(color.hexa);
          }}
        />

        <div className="flex justify-between items-center mt-4">
          <CustomButton
            color="error"
            plain
            disabled={props.showLoading}
            text="Reset"
            size="xs"
            onClick={() => {
              if (!props.showLoading) {
                props.callback("clear");
              }
            }}
          ></CustomButton>
          <CustomButton
            color="success"
            plain
            disabled={props.showLoading}
            text="Confirm"
            size="xs"
            onClick={() => {
              if (!props.showLoading) {
                props.callback("update", pickerColor);
              }
            }}
          ></CustomButton>
        </div>
      </>
    </CustomDialog>
  );
}

export default EditorColorPicker;
