export const CheckFileSize = (size) => {
  const maxSize = 600 * 1024 * 1024;

  if (size > maxSize) {
    return "File is too large. Maximum allowed size is 600MB.";
  } else {
    return "";
  }
};
