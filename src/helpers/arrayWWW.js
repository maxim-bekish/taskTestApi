export const arrayWWW = (data) => {
  sessionStorage.setItem('data', JSON.stringify(data));
  sessionStorage.setItem("dataLength", data.length);
};
