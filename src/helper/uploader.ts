const validateFileInput = (file: File): string => {
  const limitFileSize = 10;

  let result = "";
  const fileType = file.type;
  const format = fileType.split("/")[1];
  const requiredExtension = ["png", "jpeg", "jpg", "gif"];

  if (!requiredExtension.includes(format)) {
    result = `Accept ${requiredExtension.join(", ")} only`;
  } else if (file.size / 1000 / 1000 > limitFileSize) {
    result = `File size cannot exceed ${limitFileSize} MB`;
  }

  return result;
};

export default validateFileInput;
