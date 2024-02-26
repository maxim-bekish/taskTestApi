import md5 from "md5";
export const authString = () => {
  const password = "Valantis";
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return md5(`${password}_${timestamp}`);
};
