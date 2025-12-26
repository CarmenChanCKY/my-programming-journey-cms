import { Dropdown, DropdownDivider, DropdownItem } from "flowbite-react";
import CustomButton from "@/components/ui/button/CustomButton";
import { MdArrowDropDown } from "react-icons/md";
import { forwardRef } from "react";
import { customDropdownTheme } from "@/helper/flowbiteTheme";

interface CustomDropdownButtonType {
  text: string;
  itemList: Array<{
    isDivider?: boolean;
    text: string;
    onClick: () => void;
    selected?: boolean;
  }>;
  className?: string;
  color?: string;
  outline?: boolean;
  plain?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  disabled?: boolean;
  loading?: boolean;
}

// TODO: dropdown太長
const CustomDropdownButton = forwardRef(
  (props: CustomDropdownButtonType, ref: any) => {
    return (
      <Dropdown
        label=""
        dismissOnClick={true}
        className={props.className}
        placement="bottom"
        theme={customDropdownTheme}
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
          return child.isDivider !== undefined &&
            child.isDivider !== null &&
            child.isDivider ? (
            <DropdownDivider />
          ) : (
            <DropdownItem
              className={
                child.selected !== undefined &&
                child.selected !== null &&
                child.selected
                  ? "bg-gray-200"
                  : ""
              }
              key={index}
              onClick={child.onClick}
            >
              {child.text}
            </DropdownItem>
          );
        })}
      </Dropdown>
    );
  }
);

export default CustomDropdownButton;
