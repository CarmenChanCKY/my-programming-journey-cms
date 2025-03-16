import { clsx } from "clsx";
import { useContext, useEffect, useRef } from "react";
import { GlobalContext } from "@/context/GlobalContext";
import { ToastReducerType } from "@/components/ui/toast/ToastReducer";
import { alertIcon } from "@/components/ui/IconElement";

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

function Toast(props: ToastReducerType & { index: number }) {
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

      // refresh the page
      if (props.refresh) {
        window.location.reload();
      }

      // notify the toast dismiss
      if (props.onToastDismiss != undefined && props.onToastDismiss != null) {
        props.onToastDismiss();
      }
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
      {alertIcon}
      <div>{props.text}</div>
    </div>
  );
}

export default Toast;
