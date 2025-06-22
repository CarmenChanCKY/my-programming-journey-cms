import "@/styles/custom-dropdown.scss";
import { clsx } from "clsx";
import { downIcon } from "@/components/ui/IconElement";
import InputField from "@/components/ui/form/InputField";
import { useEffect, useState } from "react";
import { Dropdown, DropdownOptions } from "flowbite";
import { useFormContext } from "react-hook-form";

export interface DropdownItemListInterface {
  text: string;
  value: string;
}

interface DropdownFieldInterface {
  dropdownFieldID: string;
  name: string;
  dropdownListID: string;
  itemList: Array<DropdownItemListInterface>;
  labelText?: string;
  className?: string;
  placeholder?: string;
  prefixText?: string;
  prefixIcon?: React.ReactNode;
  suffixText?: string;
  suffixIcon?: React.ReactNode;
  disabled?: boolean;

  // validate params
  required?: boolean;
}

const downIconElement = () => {
  return <div className="suffix-icon">{downIcon}</div>;
};

function DropdownField(props: DropdownFieldInterface) {
  const { setValue } = useFormContext();
  const [dropdownControl, setDropdownControl] = useState<Dropdown | null>(null);

  useEffect(() => {
    const fieldEL = document.getElementById(props.dropdownFieldID);
    const listEl = document.getElementById(props.dropdownListID);

    const options: DropdownOptions = {
      placement: "bottom-start",
      ignoreClickOutsideClass: false,
    };
    setDropdownControl(new Dropdown(listEl, fieldEL, options));
  }, []);

  function selectItem(e: any, index: number) {
    e.stopPropagation();
    setValue(props.name, props.itemList[index].text);
    dropdownControl?.hide();
  }

  return (
    <div className={clsx("dropdown-field", props.className)}>
      <InputField
        id={props.dropdownFieldID}
        name={props.name}
        labelText={props.labelText}
        placeholder={props.placeholder}
        prefixText={props.prefixText}
        prefixIcon={props.prefixIcon}
        suffixText={props.suffixText}
        suffixIcon={props.suffixIcon ?? downIconElement()}
        disabled={props.disabled}
        readonly={true}
        required={props.required}
        className="cursor-pointer"
        inputClassName="cursor-pointer"
      ></InputField>

      <div id={props.dropdownListID} className="custom-dropdown-list hidden">
        <ul>
          {props.itemList.map((item, index) => {
            return (
              <li key={index} onClick={(e: any) => selectItem(e, index)}>
                {item.text}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default DropdownField;
