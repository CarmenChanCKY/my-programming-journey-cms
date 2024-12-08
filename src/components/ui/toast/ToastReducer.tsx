import ToastType from "@/components/ui/toast/ToastType";
import { generateRandomString } from "@/helper/common";

type ToastReducerType = {
  actionType: "insert" | "remove";
  /** redirect when timeout */
  redirectLocation?: string;
  /** refresh when timeout */
  refresh?: boolean;
} & ToastType;

function ToastReducer(
  toastList: Array<ToastReducerType & ToastType>,
  toastData: ToastReducerType & ToastType
) {
  switch (toastData.actionType) {
    case "insert":
      toastData.id = `toast-${generateRandomString(8)}-${new Date().getTime()}`;
      return [...toastList, toastData];
    case "remove":
      let newList: Array<ToastReducerType> = [...toastList];

      if (
        toastData.id !== undefined &&
        toastData.id !== null &&
        toastData.id !== ""
      ) {
        const searchIndex = toastList.findIndex((obj) => {
          return obj.id === toastData.id;
        });

        if (searchIndex !== -1) {
          newList.splice(searchIndex, 1);
        }
      }

      return newList;
    default:
      return toastList;
  }
}

export { ToastReducer, type ToastReducerType };
