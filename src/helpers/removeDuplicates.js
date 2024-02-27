export const removeDuplicates = (data) => {
  let uniqueArray = data.filter(
    (item, index, self) => index === self.findIndex((t) => t.id === item.id)
  );

  return uniqueArray;
};
