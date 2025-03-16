import { clsx } from "clsx";
import { Button } from "flowbite-react";
import { getCustomButtonTheme } from "@/helper/flowbiteTheme";

interface IconButtonType {
  icon: JSX.Element;
  type?: "button" | "submit" | "reset";
  className?: string;
  color?: string;
  outline?: boolean;
  plain?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  disabled?: boolean;
  loading?: boolean;
  customAttribute?: any;
  onClick?: (e: any) => void;
}

function IconButton(props: IconButtonType) {
  return (
    <Button
      type={
        props.disabled || props.loading ? undefined : props.type ?? "button"
      }
      className={clsx(props.className)}
      theme={getCustomButtonTheme(props.outline, props.plain, true)}
      color={props.color ?? "primary"}
      size={props.size ?? "md"}
      outline={props.outline}
      isProcessing={props.loading}
      disabled={props.loading || props.disabled}
      {...props.customAttribute}
      onClick={(e: any) => {
        if (props.onClick !== undefined && props.onClick !== null) {
          if (props.loading || props.disabled) {
          } else {
            props.onClick!(e);
          }
        }
      }}
    >
      {props.icon}
    </Button>
  );
}

export default IconButton;
