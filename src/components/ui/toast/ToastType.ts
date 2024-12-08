export default interface ToastType {
  id?: string;
  text: string;
  type?: "success" | "error" | "info";
  duration?: number;
}
