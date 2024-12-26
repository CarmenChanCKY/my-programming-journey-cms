import { ReactNode } from "react";
import { clsx } from "clsx";
import "@/styles/grid-system.scss";

type GridColumnSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

interface GridColumnProps {
  children: ReactNode;
  className?: string;
  xl?: GridColumnSize;
  lg?: GridColumnSize;
  md?: GridColumnSize;
  sm?: GridColumnSize;
  xs?: GridColumnSize;
  cols: GridColumnSize;
}

const addGridColumnClass = (props: GridColumnProps) => {
  const classList = [props.className, "grid-sys-col"];

  if (props.xl) {
    classList.push(`grid-sys-col-xl-${props.xl.toString()}`);
  }

  if (props.lg) {
    classList.push(`grid-sys-col-lg-${props.lg.toString()}`);
  }

  if (props.md) {
    classList.push(`grid-sys-col-md-${props.md.toString()}`);
  }

  if (props.sm) {
    classList.push(`grid-sys-col-sm-${props.sm.toString()}`);
  }

  if (props.xs) {
    classList.push(`grid-sys-col-xs-${props.xs.toString()}`);
  }

  if (props.cols) {
    classList.push(`grid-sys-col-${props.cols.toString()}`);
  }

  return classList;
};

function GridColumn(props: GridColumnProps) {
  return (
    <div className={clsx(addGridColumnClass(props))}>{props.children}</div>
  );
}

export default GridColumn;
