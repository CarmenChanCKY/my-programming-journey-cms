/* eslint-disable @typescript-eslint/no-unused-expressions */
import { clsx } from "clsx";
import { css } from "@emotion/css";
import { genBgHoverActiveColor } from "@/helper/color";
import "@/styles/button.scss";

interface IconButtonType {
  icon: JSX.Element;
  type?: "button" | "submit" | "reset";
  className?: string;
  outlined?: boolean;
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
  const classList: Array<string> = ["icon-btn"];

  if (props.className !== undefined) {
    classList.push(props.className);
  }

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
  } else {
    if (!props.bgColor && !props.iconColor) {
      classList.push("default-color");
    }
  }

  return classList;
};

const customBtnStyle = (props: IconButtonType) => {
  const style: any = {};
  const hoverStyle: any = {};
  const activeStyle: any = {};

  if (!props.disabled) {
    if (props.bgColor) {
      const genColor = genBgHoverActiveColor(props.bgColor);

      if (!props.plain) {
        style.backgroundColor = genColor.bgColor;
      }

      hoverStyle.backgroundColor = genColor.hoverColor;
      activeStyle.backgroundColor = genColor.activeColor;
    }

    if (props.iconColor) {
      const genColor = genBgHoverActiveColor(props.iconColor);
      style["& svg"] = { color: genColor.bgColor };
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

function IconButton(props: IconButtonType) {
  return (
    <button
      type={props.type ?? "button"}
      className={clsx(setClass(props), customBtnStyle(props))}
      {...props.customAttribute}
      onClick={(e: any) => {
        !props.disabled && !props.loading && props.onClick
          ? props.onClick!(e)
          : undefined;
      }}
    >
      <div className="btn-content" style={{ opacity: props.loading ? 0 : 1 }}>
        {props.icon}
      </div>
      {props.loading ? <div className="btn-spinner"></div> : null}
    </button>
  );
}

export default IconButton;
