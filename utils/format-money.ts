export const formatMoney = (amount: number) => {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "PLN",
  });
};
