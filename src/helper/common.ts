import { DropdownItemListInterface } from "@/components/ui/form/DropdownField";

const log = (msg: any) => {
  if (
    window.location.href.includes("localhost") ||
    window.location.href.includes("127.0.0.1")
  ) {
    console.log(msg);
  }
};

const errorLog = (msg: any) => {
  if (
    window.location.href.includes("localhost") ||
    window.location.href.includes("127.0.0.1")
  ) {
    console.error(msg);
  }
};

const rounding = (num: number, decimal: number = 0): number => {
  decimal = 10 ** decimal;
  return Math.round(num * decimal) / decimal;
};

const generateRandomString = (len: number): string => {
  const strList =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
  const maxLength = strList.length;

  let result = "";
  for (let i = 0; i < len; i++) {
    result += strList[Math.floor(Math.random() * maxLength)];
  }

  return result;
};

const searchDropdownValueByText = (
  text: string,
  itemList: Array<DropdownItemListInterface>
): number | string => {
  const index = itemList.findIndex((obj) => {
    return obj.text === text;
  });

  if (index !== -1) {
    return itemList[index].value;
  }

  return -1;
};

const dateToYMD = (date: Date) => {
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${date.getFullYear()}-${m}-${d}`;
};

export {
  log,
  errorLog,
  rounding,
  generateRandomString,
  searchDropdownValueByText,
  dateToYMD,
};
