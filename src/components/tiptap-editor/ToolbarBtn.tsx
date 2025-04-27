import { customTooltipTheme } from "@/helper/flowbiteTheme";
import { useCurrentEditor } from "@tiptap/react";
import { Tooltip } from "flowbite-react";
import { MdFormatColorFill, MdOutlineFormatColorText } from "react-icons/md";
import IconButton from "../ui/button/IconButton";
import CustomDropdownButton from "../ui/button/CustomDropdownButton";

interface ToolbarBtnProps {
  child: any;
  index: number;
  childIndex: number;
}

function ToolbarBtn(props: ToolbarBtnProps) {
//   const { editor } = useCurrentEditor();

//   if (!editor) {
//     return null;
  //}
  console.log("render index:", props.index);

//   if (props.child.type === "button" || props.child.type === "colorPicker") {
//     let color = undefined;
//     let icon = props.child.icon;

//     if (props.child.type === "button") {
//       color = props.child.active ? "secondary" : "stone";
//     } else if (props.child.type === "colorPicker") {
//       color = "";

//       if (props.child.name === "textColor") {
//         color = editor.getAttributes("textStyle").color ?? "";
//         icon = <MdOutlineFormatColorText color={color} />;
//       } else {
//         color = editor.getAttributes("highlight").color ?? "";
//         icon = <MdFormatColorFill color={color} />;
//       }
//     }

//     return (
//       <Tooltip
//         content={props.child.tooltipText}
//         placement="bottom"
//         key={`group-${props.index}-${props.childIndex}`}
//         theme={customTooltipTheme}
//       >
//         <IconButton
//           plain
//           icon={icon}
//           color={color}
//           size="sm"
//           disabled={props.child.disabled}
//           onClick={(e) => {
//             props.child.onClick();
//           }}
//         ></IconButton>
//       </Tooltip>
//     );
//   } else if (props.child.type === "dropdown") {
//     return (
//       <CustomDropdownButton
//         key={`group-${props.index}-${props.childIndex}`}
//         text={props.child.text()}
//         itemList={props.child.itemList}
//         plain
//         size="sm"
//         color={props.child.active ? "secondary" : "stone"}
//       ></CustomDropdownButton>
//     );
//   }

  return null;
}

export default ToolbarBtn;
