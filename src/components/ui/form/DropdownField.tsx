import "@/styles/custom-dropdown.scss";
import { clsx } from "clsx";
import { downIcon } from "@/components/ui/IconElement";
import InputField from "@/components/ui/form/InputField";
import { useEffect, useState } from "react";
import { Dropdown, DropdownOptions } from "flowbite";
import {
  Controller,
  ControllerRenderProps,
  FieldValues,
  useFormContext,
  useWatch,
} from "react-hook-form";

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
  multiple?: boolean;

  // validate params
  required?: boolean;
}

const downIconElement = () => {
  return <div className="suffix-icon">{downIcon}</div>;
};

function DropdownField(props: DropdownFieldInterface) {
  const { control, setValue } = useFormContext();
  const [dropdownControl, setDropdownControl] = useState<Dropdown | null>(null);
  const watchedValue = useWatch({ control, name: props.name });
  const [activeIndexList, setActiveIndexList] = useState<Set<number>>(
    () => new Set<number>()
  );

  useEffect(() => {
    const fieldEL = document.getElementById(props.dropdownFieldID);
    const listEl = document.getElementById(props.dropdownListID);

    const options: DropdownOptions = {
      placement: "bottom-start",
      ignoreClickOutsideClass: false,
    };
    setDropdownControl(new Dropdown(listEl, fieldEL, options));
  }, []);

  useEffect(() => {
    const newSet = new Set<number>();
    const value = watchedValue;
    let selectedTexts: string[] = [];

    if (props.multiple) {
      if (Array.isArray(value)) {
        selectedTexts = value.map((v: any) => String(v));
      } else if (typeof value === "string" && value !== "") {
        selectedTexts = value.split(", ").map((s) => s.trim());
      }
    } else {
      if (value !== undefined && value !== null && value !== "") {
        selectedTexts = [String(value)];
      }
    }

    props.itemList.forEach((item, idx) => {
      if (selectedTexts.includes(String(item.text))) newSet.add(idx);
    });

    setActiveIndexList(newSet);
  }, [props.itemList, watchedValue, props.multiple]);

  function selectItem(
    e: any,
    index: number,
    field: ControllerRenderProps<FieldValues, string>
  ) {
    e.stopPropagation();

    if (props.multiple) {
      console.log(field.value)
      // Handle both array and string values
      const valueArray = Array.isArray(field.value)
        ? field.value.map((v: any) => String(v))
        : (typeof field.value === "string" ? field.value.split(", ") : []);

      const currentFieldValue = valueArray.filter((value: string) => {
        return value !== undefined && value !== null && value !== "";
      });

      let newValues = [...currentFieldValue];
      const newSet = new Set(activeIndexList);

      if (newSet.has(index)) {
        newValues = newValues.filter((text: string) => {
          return text !== props.itemList[index].text;
        });

        newSet.delete(index);
      } else {
        newValues.push(props.itemList[index].text);
        newSet.add(index);
      }
      setActiveIndexList(newSet);
      setValue(props.name, newValues.join(", "));
    } else {
      const newSet = new Set<number>();
      newSet.add(index);
      setActiveIndexList(newSet);
      setValue(props.name, props.itemList[index].text);
      dropdownControl?.hide();
    }
  }

  return (
    <Controller
      control={control}
      name={props.name}
      render={({ field }) => {
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
            <div
              id={props.dropdownListID}
              className="custom-dropdown-list hidden"
            >
              <ul>
                {props.itemList.map((item, index) => {
                  return (
                    <li
                      className={activeIndexList.has(index) ? "active" : ""}
                      key={index}
                      onClick={(e: any) => selectItem(e, index, field)}
                    >
                      {item.text}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        );
      }}
    ></Controller>
  );
}

export default DropdownField;
