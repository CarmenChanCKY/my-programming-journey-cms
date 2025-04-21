import { customDialogTheme } from "@/helper/flowbiteTheme";
import { CustomFlowbiteTheme, Modal } from "flowbite-react";

interface DialogInterface {
  open: boolean;
  title?: string;
  children: JSX.Element;
  modalTheme?: CustomFlowbiteTheme["modal"];
  onClose: () => void;
}

function CustomDialog(props: DialogInterface) {
  return (
    <Modal
      show={props.open}
      onClose={props.onClose}
      theme={props.modalTheme ?? customDialogTheme}
      position="center"
    >
      <Modal.Header className="items-center">{props.title}</Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
    </Modal>
  );
}

export default CustomDialog;
