import { clsx } from "clsx";
import { Button } from "flowbite-react";
import { getCustomButtonTheme } from "@/helper/flowbiteTheme";
import { forwardRef } from "react";

// https://flowbite-react.com/docs/components/button

interface CustomButtonType {
  text: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  color?: string;
  outline?: boolean;
  plain?: boolean;
  block?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  disabled?: boolean;
  loading?: boolean;
  customAttribute?: any;
  appendIcon?: JSX.Element;
  onClick?: (e: any) => void;
}

const CustomButton = forwardRef((props: CustomButtonType, ref: any) => {
  return (
    <Button
      ref={ref}
      type={
        props.disabled || props.loading ? undefined : props.type ?? "button"
      }
      className={clsx(props.className)}
      theme={getCustomButtonTheme(props.outline, props.plain)}
      color={props.color ?? "primary"}
      size={props.size ?? "md"}
      outline={props.outline}
      fullSized={props.block}
      isProcessing={props.loading}
      disabled={props.loading || props.disabled}
      onClick={(e: any) => {
        if (props.onClick !== undefined && props.onClick !== null) {
          if (props.loading || props.disabled) {
          } else {
            props.onClick!(e);
          }
        }
      }}
    >
      <div className="flex items-center">
        {props.text}
        {props.appendIcon}
      </div>
    </Button>
  );
});

export default CustomButton;
