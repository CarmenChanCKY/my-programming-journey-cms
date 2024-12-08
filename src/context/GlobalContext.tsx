import {
  ToastReducer,
  ToastReducerType,
} from "@/components/ui/toast/ToastReducer";
import { createContext, useReducer, useState } from "react";

type GlobalContextType = {
  // for loading spinner
  showLoading: boolean;
  setLoading: (loading: boolean) => void;

  // for toast
  toastList: Array<ToastReducerType>;
  toastDispatch: (toastData: ToastReducerType) => void;
};

const GlobalContext = createContext<GlobalContextType>({
  // for loading spinner
  showLoading: false,
  setLoading: () => {},

  // for toast
  toastList: [],
  toastDispatch: () => {},
});

const GlobalProvider = ({ children }: any) => {
  const [showLoading, setLoading] = useState(false);
  const [toastList, toastDispatch] = useReducer(ToastReducer, []);

  return (
    <GlobalContext.Provider
      value={{
        showLoading,
        setLoading,
        toastList,
        toastDispatch,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalProvider };
