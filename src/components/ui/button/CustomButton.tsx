import { clsx } from "clsx";
import { css } from "@emotion/css";
import { hexToHsl, hslCSS } from "@/helper/color";
import "@/styles/button.scss";

interface CustomButtonType {
  text: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  outlined?: boolean; //
  plain?: boolean; //
  bgColor?: string;
  textColor?: string;
  block?: boolean;
  small?: boolean;
  large?: boolean;
  disabled?: boolean;
  loading?: boolean;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  onClick?: (e: any) => void;
}

const setClass = (props: CustomButtonType) => {
  const classList: any = ["btn", props.className];

  if (props.outlined) {
    classList.push("btn-outlined");
  } else if (props.plain) {
    classList.push("btn-plain");
  } else {
    classList.push("btn-normal");
  }

  if (props.block) {
    classList.push("w-full");
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

const customBtnStyle = (props: CustomButtonType) => {
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

    if (props.textColor) {
      style.color = props.textColor;
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

  if (props.paddingTop) {
    style.paddingTop = `${props.paddingTop}px`;
  }

  if (props.paddingBottom) {
    style.paddingBottom = `${props.paddingBottom}px`;
  }

  if (props.paddingLeft) {
    style.paddingLeft = `${props.paddingLeft}px`;
  }

  if (props.paddingRight) {
    style.paddingRight = `${props.paddingRight}px`;
  }

  return css(style);
};

function CustomButton(props: CustomButtonType) {
  return (
    <button
      type={props.type ?? "button"}
      className={clsx(setClass(props), customBtnStyle(props))}
      onClick={(e: any) => {
        !props.loading && !props.disabled && props.onClick
          ? props.onClick!(e)
          : undefined;
      }}
      disabled={props.loading || props.disabled}
    >
      <div className="btn-content" style={{ opacity: props.loading ? 0 : 1 }}>
        {props.text}
      </div>
      {props.loading ? <div className="btn-spinner"></div> : null}
    </button>
  );
}

export default CustomButton;
