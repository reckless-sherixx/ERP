interface formatCurrencyProps {
  amount: number;
  currency: "INR";
}

export function formatCurrency({ amount, currency }: formatCurrencyProps) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
  }).format(amount);
}