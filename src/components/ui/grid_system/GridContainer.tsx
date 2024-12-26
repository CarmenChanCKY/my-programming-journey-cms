import { ReactNode } from "react";
import { clsx } from "clsx";
import "@/styles/grid-system.scss";

interface GridContainerProps {
  children: ReactNode;
  className?: string;
}

function GridContainer(props: GridContainerProps) {
  return (
    <div className={clsx("grid-sys-container", props.className)}>
      {props.children}
    </div>
  );
}

export default GridContainer;
