export function validateTitle(value) {
  return value.trim().length >= 3 ? "" : "Tên sách phải có ít nhất 3 ký tự.";
}

export function validateAuthor(value) {
  return value.trim() ? "" : "Vui lòng nhập tên tác giả.";
}

export function validateGenre(value) {
  return value ? "" : "Vui lòng chọn thể loại.";
}

export function validateYear(value) {
  const max = new Date().getFullYear();
  const year = Number(value);
  if (value === "" || !Number.isInteger(year)) return "Vui lòng nhập năm hợp lệ.";
  if (year < 1900 || year > max) return `Năm phải từ 1900 đến ${max}.`;
  return "";
}

export const validators = {
  title: validateTitle,
  author: validateAuthor,
  genre: validateGenre,
  year: validateYear,
};
