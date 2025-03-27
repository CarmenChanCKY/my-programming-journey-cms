import { clsx } from "clsx";
import { useFormContext } from "react-hook-form";
import {
  emailRegex,
  numberRegex,
  floatingRegex,
  inputNumberOnly,
  inputFloatingOnly,
} from "@/helper/validator";

interface InputFieldType {
  id: string;
  name: string;
  className?: string;
  inputClassName?: string;
  type?: string;
  labelText?: string;
  placeholder?: string;
  prefixText?: string;
  prefixIcon?: React.ReactNode;
  suffixText?: string;
  suffixIcon?: React.ReactNode;
  disabled?: boolean;
  readonly?: boolean;
  customAttribute?: any;

  // validate params
  required?: boolean;
  validateEmail?: boolean;
  validateNumber?: boolean;
  validateFloating?: boolean;
  customValidator?: Array<{
    rules: any;
    errorMsg: string;
  }>;

  // Format
  inputNumberOnly?: boolean;
  inputFloatingOnly?: boolean;
}

const setInputClass = (props: InputFieldType, isInvalid: boolean = false) => {
  const classList: Array<string> = [
    "block",
    "w-full",
    props.labelText ? "mt-1" : "",
  ];

  if (props.suffixIcon || props.suffixText) {
    classList.push("pr-9");
  }

  if (props.prefixIcon) {
    classList.push("pl-9");
  } else if (props.prefixText) {
    classList.push("pl-5");
  }

  if (isInvalid) {
    classList.push("error-field");
  }

  return classList;
};

const formatInput = (e: any, props: InputFieldType) => {
  if (props.inputNumberOnly) {
    return inputNumberOnly(e.nativeEvent);
  } else if (props.inputFloatingOnly) {
    return inputFloatingOnly(e.nativeEvent);
  }

  return true;
};

function InputField(props: InputFieldType) {
  const { register, formState, getFieldState } = useFormContext();
  const { invalid, error } = getFieldState(props.name, formState);

  return (
    <>
      {/* label */}
      {props.labelText ? (
        <label htmlFor={props.id} className="mb-2">
          {props.labelText}
        </label>
      ) : null}

      <div
        className={clsx("relative rounded-md input-field", props.className)}
        {...props.customAttribute}
      >
        {/* prefix element */}
        {props.prefixIcon ? (
          props.prefixIcon
        ) : props.prefixText ? (
          <div className="prefix-text">{props.prefixText}</div>
        ) : null}

        <input
          {...register(props.name, {
            setValueAs(value) {
              // trim the input value
              return value.trim();
            },
            required: { value: props.required ?? false, message: "Required." },
            validate: (v) => {
              if (props.validateEmail) {
                return new RegExp(emailRegex).test(v) ? true : "Email invalid.";
              }

              if (props.validateNumber) {
                return new RegExp(numberRegex).test(v)
                  ? true
                  : "Accept digits only.";
              }

              if (props.validateFloating) {
                return new RegExp(floatingRegex).test(v)
                  ? true
                  : "Accept floating number only.";
              }

              if (props.customValidator) {
                for (let i = 0; i < props.customValidator.length; i++) {
                  return props.customValidator[i].rules
                    ? true
                    : props.customValidator[i].errorMsg;
                }
              }
              return true;
            },
          })}
          disabled={props.disabled}
          readOnly={props.readonly}
          id={props.id}
          name={props.name}
          type={props.type ?? "text"}
          placeholder={props.placeholder}
          className={clsx(setInputClass(props, invalid), props.inputClassName)}
          onBeforeInput={(e: any) => {
            return formatInput(e, props);
          }}
        />

        {/* suffix element */}
        {props.suffixIcon ? (
          props.suffixIcon
        ) : props.suffixText ? (
          <div className="suffix-text">{props.suffixText}</div>
        ) : null}
      </div>

      {/* error message */}
      {invalid ? <div className="error-msg">{error?.message}</div> : null}
    </>
  );
}

export default InputField;
