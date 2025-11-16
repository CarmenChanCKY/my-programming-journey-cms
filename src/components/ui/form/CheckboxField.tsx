import { Checkbox, Label } from "flowbite-react";
import { useFormContext } from "react-hook-form";

interface CheckboxFieldType {
  id: string;
  name: string;
  labelText?: string;
}

function CheckboxField(props: CheckboxFieldType) {
  const { register } = useFormContext();

  return (
    <div className="flex items-center gap-2">
      <Checkbox id={props.id} {...register(props.name)} />
      <Label htmlFor={props.id} className="flex">
        {props.labelText}
      </Label>
    </div>
  );
}

export default CheckboxField;
