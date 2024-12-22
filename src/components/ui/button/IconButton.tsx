import { clsx } from "clsx";
import { css } from "@emotion/css";
import { hexToHsl, hslCSS } from "@/helper/color";
import "@/styles/button.scss";

interface IconButtonType {
  icon: JSX.Element;
  type?: "button" | "submit" | "reset";
  className?: string;
  outlined?: boolean; //
  plain?: boolean; //
  bgColor?: string;
  iconColor?: string;
  small?: boolean;
  large?: boolean;
  disabled?: boolean;
  loading?: boolean;
  customAttribute?: any;
  onClick?: (e: any) => void;
}

const setClass = (props: IconButtonType) => {
  const classList: any = ["icon-btn", props.className];

  if (props.outlined) {
    classList.push("btn-outlined");
  } else if (props.plain) {
    classList.push("btn-plain");
  } else {
    classList.push("btn-normal");
  }

  if (props.small) {
    classList.push("btn-small");
  }

  if (props.large) {
    classList.push("btn-large");
  }

  if (props.disabled || props.loading) {
    classList.push("btn-disabled");
  }

  return classList;
};

const customBtnStyle = (props: IconButtonType) => {
  const style: any = {};
  const hoverStyle: any = {};
  const activeStyle: any = {};

  if (!props.disabled) {
    if (props.bgColor) {
      const hslColor = hexToHsl(props.bgColor);
      style.backgroundColor = hslCSS(hslColor.h, hslColor.s, hslColor.l);
      hoverStyle.backgroundColor = hslCSS(
        hslColor.h,
        hslColor.s,
        hslColor.l,
        true
      );

      activeStyle.backgroundColor = hslCSS(
        hslColor.h,
        hslColor.s,
        hslColor.l,
        false,
        true
      );
    }
  }

  if (!props.disabled && !props.loading) {
    // hover style
    if (Object.keys(hoverStyle).length > 0) {
      style["&:hover"] = hoverStyle;
    }

    // active style
    if (Object.keys(activeStyle).length > 0) {
      style["&:active"] = activeStyle;
    }
  }

  return css(style);
};

const IconButton = (props: IconButtonType) => {
  return (
    <button
      type={props.type ?? "button"}
      className={clsx(setClass(props), customBtnStyle(props))}
      {...props.customAttribute}
      onClick={(e: any) => {
        !props.disabled && props.onClick ? props.onClick!(e) : undefined;
      }}
    >
      <div className="btn-content" style={{ opacity: props.loading ? 0 : 1 }}>
        {props.icon}
      </div>
      {props.loading ? <div className="btn-spinner"></div> : null}
    </button>
  );
};

export default IconButton;
