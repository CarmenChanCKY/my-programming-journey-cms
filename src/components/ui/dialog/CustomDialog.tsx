import { customDialogTheme } from "@/helper/flowbiteTheme";
import { Modal } from "flowbite-react";

interface DialogInterface {
  open: boolean;
  title?: string;
  children: JSX.Element;

  onClose: () => void;
}

function CustomDialog(props: DialogInterface) {
  return (
    <Modal
      show={props.open}
      onClose={props.onClose}
      theme={customDialogTheme}
      position="center"
    >
      <Modal.Header className="items-center">{props.title}</Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
    </Modal>
  );
}

export default CustomDialog;
