const hexRegex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const numberRegex = /^[0-9]+$/i;
const floatingRegex = /^[0-9]+([.]?[0-9]+)?$/i;

const inputNumberOnly = (event: any): boolean => {
  // [0-9]
  if (event.charCode >= 48 && event.charCode <= 57) {
    return true;
  }

  return event.preventDefault();
};

const inputFloatingOnly = (event: any): boolean => {
  // [0-9][.][0-9]
  if ((event.charCode >= 48 && event.charCode <= 57) || event.charCode === 46) {
    return true;
  }

  return event.preventDefault();
};

export {
  hexRegex,
  emailRegex,
  numberRegex,
  floatingRegex,
  inputNumberOnly,
  inputFloatingOnly,
};
