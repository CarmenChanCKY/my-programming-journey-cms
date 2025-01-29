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

export { log, errorLog, rounding, generateRandomString };
