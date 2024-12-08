import { ReactNode } from "react";
import { clsx } from "clsx";
import '@/styles/grid-system.scss';

interface GridRowProps {
  children: ReactNode;
  className?: string;
}

const GridRow = (props: GridRowProps) => {
  return (
    <div className={clsx("grid-sys-row", props.className)}>
      {props.children}
    </div>
  );
};

export default GridRow;
