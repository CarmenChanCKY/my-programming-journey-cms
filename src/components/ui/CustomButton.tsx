import { clsx } from "clsx";
import { css } from "@emotion/css";
import { hexToHsl, hslCSS } from "@/helper/color";
import '@/styles/button.scss';

interface ButtonType {
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
  readonly?: boolean;
  loading?: boolean;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  onClick?: (e: any) => void;
}

const setClass = (props: ButtonType) => {
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

  if (props.disabled) {
    classList.push("btn-disabled");
  }

  if (props.readonly) {
    classList.push("btn-readonly");
  }

  if (props.loading) {
    classList.push("btn-loading");
  }

  return classList;
};

const customBtnStyle = (props: ButtonType) => {
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

  if (!props.disabled && !props.readonly && !props.loading) {
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

const CustomButton = (props: ButtonType) => {
  return (
    <button
      type={props.type ?? "button"}
      className={clsx(setClass(props), customBtnStyle(props))}
      onClick={(e: any) => {
        !props.disabled && !props.readonly && props.onClick
          ? props.onClick!(e)
          : undefined;
      }}
    >
      <div className="btn-content" style={{ opacity: props.loading ? 0 : 1 }}>
        {props.text}
      </div>
      {props.loading ? <div className="btn-spinner"></div> : null}
    </button>
  );
};

export default CustomButton;
