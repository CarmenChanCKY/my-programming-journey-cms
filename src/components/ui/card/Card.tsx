import { ReactNode } from "react";
import { clsx } from "clsx";

interface CardType {
  children: ReactNode;
  className?: string;
  bgColor?: string;
  borderWidth?: number;
  borderColor?: string;
  showShadow?: boolean;
  flat?: boolean;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
}

const setClass = (props: CardType) => {
  const classList = [props.className, "p-4", "rounded-md"];

  if (props.showShadow) {
    classList.push("shadow-[0px_0px_20px_0px_rgba(230,230,230,1)]");
  } else if (props.flat) {
    // do nothing
  } else {
    classList.push(`border-[#eee]`);
  }

  return classList;
};

const setInlineStyle = (props: CardType) => {
  const inlineStyle: any = {
    backgroundColor: props.bgColor ? props.bgColor : "#ffffff",
  };

  if (!props.showShadow && !props.flat) {
    if (props.borderWidth) {
      inlineStyle.borderWidth = `${props.borderWidth}px`;
    }
    if (props.borderColor) {
      inlineStyle.borderColor = props.borderColor;
    }
  }

  if (props.paddingTop) {
    inlineStyle.paddingTop = `${props.paddingTop}px`;
  }

  if (props.paddingBottom) {
    inlineStyle.paddingBottom = `${props.paddingBottom}px`;
  }

  if (props.paddingLeft) {
    inlineStyle.paddingLeft = `${props.paddingLeft}px`;
  }

  if (props.paddingRight) {
    inlineStyle.paddingRight = `${props.paddingRight}px`;
  }

  return inlineStyle;
};

function Card(props: CardType) {
  return (
    <div className={clsx(setClass(props))} style={setInlineStyle(props)}>
      {props.children}
    </div>
  );
}

export default Card;
