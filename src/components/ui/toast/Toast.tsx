import ToastType from "@/components/ui/toast/ToastType";
import { clsx } from "clsx";
import { useContext, useEffect, useRef } from "react";
import { GlobalContext } from "@/context/GlobalContext";

const alertCSS = (type: "success" | "error" | "info") => {
  const cssArr = ["toast"];

  if (type === "success") {
    cssArr.push("toast-success");
  } else if (type === "error") {
    cssArr.push("toast-error");
  } else if (type === "info") {
    cssArr.push("toast-info");
  }

  return cssArr;
};

const Toast = (props: ToastType & { index: number }) => {
  const toastRef = useRef<HTMLDivElement | null>(null);
  const { toastDispatch } = useContext(GlobalContext);

  // auto remove from toast list
  useEffect(() => {
    // default hide duration is 3 second
    const hideDuration = props.duration ?? 3000;
    const hideTimeout = setTimeout(() => {
      // add hide animation
      toastRef.current?.classList.add("toast-animation-remove");

      setTimeout(() => {
        // remove from list
        toastDispatch({
          id: props.id,
          text: "",
          actionType: "remove",
        });
      }, 350);
    }, hideDuration);

    return () => {
      clearTimeout(hideTimeout);
    };
  }, []);

  return (
    <div
      ref={toastRef}
      id={props.id}
      className={clsx(alertCSS(props.type ?? "info"))}
      role="alert"
    >
      <svg
        className="flex-shrink-0 inline w-4 h-4 me-3"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
      </svg>
      <div>{props.text}</div>
    </div>
  );
};

export default Toast;
