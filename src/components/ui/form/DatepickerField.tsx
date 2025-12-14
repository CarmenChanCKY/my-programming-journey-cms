import { Datepicker } from "flowbite-react";
import { Controller, useFormContext } from "react-hook-form";

interface DatePickerFieldInterface {
  name: string;
  labelText?: string;
  placeholder?: string;
  disabled?: boolean;

  // validate params
  required?: boolean;
}

function DatePickerField(props: DatePickerFieldInterface) {
  const { control, setValue, formState, getFieldState } = useFormContext();
  const { invalid, error } = getFieldState(props.name, formState);

  const onDateChanged = (date: Date | null) => {
    setValue(props.name, date);
  };

  return (
    <Controller
      control={control}
      name={props.name}
      rules={{
        required: { value: props.required ?? false, message: "Required." },
      }}
      disabled={props.disabled}
      render={({ field }) => {
        return (
          <>
            {/* label */}
            {props.labelText ? <label>{props.labelText}</label> : null}
            <Datepicker
              required
              disabled={props.disabled}
              {...field}
              placeholder={props.placeholder}
              onChange={onDateChanged}
              showClearButton={false}
              showTodayButton={false}
            />

            {/* error message */}
            {invalid ? <div className="error-msg">{error?.message}</div> : null}
          </>
        );
      }}
    ></Controller>
  );
}

export default DatePickerField;
