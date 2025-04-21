import { Dropdown, DropdownItem } from "flowbite-react";
import CustomButton from "@/components/ui/button/CustomButton";
import { MdArrowDropDown } from "react-icons/md";
import { forwardRef } from "react";

interface CustomDropdownButtonType {
  text: string;
  itemList: Array<{ text: string; onClick: () => void }>;
  className?: string;
  color?: string;
  outline?: boolean;
  plain?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  disabled?: boolean;
  loading?: boolean;
}

const CustomDropdownButton = forwardRef(
  (props: CustomDropdownButtonType, ref: any) => {
    return (
      <Dropdown
        label=""
        dismissOnClick={true}
        className={props.className}
        renderTrigger={() => (
          <CustomButton
            ref={ref}
            text={props.text}
            size={props.size}
            disabled={props.disabled}
            loading={props.loading}
            color={props.color}
            outline={props.outline}
            plain={props.plain}
            appendIcon={<MdArrowDropDown size={18} />}
          ></CustomButton>
        )}
      >
        {props.itemList.map((child, index) => {
          return <DropdownItem key={index} onClick={child.onClick}>{child.text}</DropdownItem>;
        })}
      </Dropdown>
    );
  }
);

// const CustomDropdownButton = forwardRef(function CustomDropdownButton(props: CustomDropdownButtonType,ref) {
//   return (
//     <Dropdown
//       label=""
//       dismissOnClick={true}
//       className={props.className}
//       renderTrigger={() => (
//         <CustomButton
//           text={props.text}
//           size={props.size}
//           disabled={props.disabled}
//           loading={props.loading}
//           color={props.color}
//           outline={props.outline}
//           plain={props.plain}
//           appendIcon={<MdArrowDropDown size={18} />}
//         ></CustomButton>
//       )}
//     >
//       {props.itemList.map((child, index) => {
//         return <DropdownItem key={index}>{child.text}</DropdownItem>;
//       })}
//     </Dropdown>
//  } );
// }

export default CustomDropdownButton;
