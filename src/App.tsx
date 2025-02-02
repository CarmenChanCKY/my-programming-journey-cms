import { RouterProvider } from "react-router-dom";
import { router } from "@/router/route";
import { GlobalContext, GlobalProvider } from "@/context/GlobalContext";
import { useContext } from "react";
import Toast from "@/components/ui/toast/Toast";
import { ToastReducerType } from "@/components/ui/toast/ToastReducer";

function App() {
  return (
    <GlobalProvider>
      <MainContent />
    </GlobalProvider>
  );
}

function MainContent() {
  const { showLoading, toastList } = useContext(GlobalContext);

  return (
    <main className="min-h-full h-full">
      <RouterProvider router={router} />

      {/* loading spinner */}
      {showLoading ? (
        <div className="loading-spinner-container">
          <div className="spinner"></div>
        </div>
      ) : null}

      {/* snack bar */}
      {toastList.length > 0 ? (
        <div className="fixed top-5 right-5">
          {toastList.map((toastData: ToastReducerType, index: number) => {
            return <Toast {...toastData} index={index} key={toastData.id} />;
          })}
        </div>
      ) : null}
    </main>
  );
}

export default App;
