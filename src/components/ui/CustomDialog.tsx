import { CustomFlowbiteTheme, Modal } from "flowbite-react";

interface DialogInterface {
  open: boolean;
  title?: string;
  children: JSX.Element;

  onClose: () => void;
}

function CustomDialog(props: DialogInterface) {
  const customDialogTheme: CustomFlowbiteTheme["modal"] = {
    content: {
      base: "relative w-full p-4 md:h-auto",
    },
    header: {
      base: "flex items-start justify-between rounded-t border-b px-5 py-3 dark:border-gray-600",
    },
  };

  return (
    <Modal
      show={props.open}
      onClose={props.onClose}
      theme={customDialogTheme}
      position="center"
    >
      <Modal.Header>{props.title}</Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
    </Modal>
  );
}

export default CustomDialog;
