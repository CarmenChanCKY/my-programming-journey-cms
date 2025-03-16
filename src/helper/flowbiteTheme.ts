import { CustomFlowbiteTheme } from "flowbite-react";
import {
  getNormalButtonColorTheme,
  getOutlineButtonColorTheme,
} from "@/helper/color";

// button theme
export const getCustomButtonTheme = (
  outline?: boolean,
  plain?: boolean,
  isIconBtn: boolean = false
): CustomFlowbiteTheme["button"] => {
  const theme: CustomFlowbiteTheme["button"] = {
    base: "group relative flex items-stretch justify-center text-center font-medium transition-[color,background-color,border-color,text-decoration-color,fill,stroke,box-shadow] focus:z-10 focus:outline-none",
    color: getNormalButtonColorTheme(outline, plain),
    outline: {
      color: getOutlineButtonColorTheme(),
      on: "rounded-md flex w-full justify-center align-center transition-all duration-75 ease-in",
    },
    pill: {
      off: "rounded-md",
    },
  };

  if (!isIconBtn) {
    theme.base = `${theme.base} p-0.4`;
  } else {
    // for icon button only
    theme.size = {
      xs: "p-1 [&>svg]:size-4",
      sm: "p-1 [&>svg]:size-5",
      md: "p-1 [&>svg]:size-6",
      lg: "p-1 [&>svg]:size-7",
      xl: "p-1 [&>svg]:size-8",
    };

    // for loading state
    theme.spinnerSlot = "flex h-full items-center";
    theme.inner = {
      isProcessingPadding: {
        xs: "[&>svg]:hidden",
        sm: "[&>svg]:hidden",
        md: "[&>svg]:hidden",
        lg: "[&>svg]:hidden",
        xl: "[&>svg]:hidden",
      },
    };

    theme.spinnerLeftPosition = {
      xs: "[&_svg]:size-4 [&_svg]:block",
      sm: "[&_svg]:size-5 [&_svg]:block",
      md: "[&_svg]:size-6 [&_svg]:block",
      lg: "[&_svg]:size-7 [&_svg]:block",
      xl: "[&_svg]:size-8 [&_svg]:block",
    };
  }

  return theme;
};

// dialog theme
export const customDialogTheme: CustomFlowbiteTheme["modal"] = {
  content: {
    base: "relative w-full p-4 md:h-auto",
  },
  header: {
    base: "flex items-start justify-between rounded-t border-b px-5 py-3 dark:border-gray-600",
  },
};

// progress bar theme
export const customProgressTheme: CustomFlowbiteTheme["progress"] = {
  base: "relative w-full overflow-hidden bg-white",
  bar: "progress-bar space-x-2 text-center font-medium leading-none",
  color: {
    accent: "bg-accent-400",
  },
  size: {
    xs: "h-1",
  },
};

// table theme
export const customTableTheme: CustomFlowbiteTheme["table"] = {
  root: {
    base: "w-full text-left text-sm text-gray-500 divide-y",
  },
  head: {
    base: "group/head text-sm uppercase text-gray-700",
    cell: {
      base: "bg-white px-6 py-3 group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg",
    },
  },
  body: {
    base: "group/body bg-white divide-y",
    cell: {
      base: "px-6 py-2 text-sm group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg",
    },
  },
  row: {
    hovered: "hover:bg-gray-50",
  },
};
