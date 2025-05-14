interface formatCurrencyProps {
  amount: number;
  currency: "INR" | "EUR";
}

export function formatCurrency({ amount, currency }: formatCurrencyProps) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
  }).format(amount);
}
