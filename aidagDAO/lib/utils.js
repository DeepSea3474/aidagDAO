export function formatNumber(num) {
  if (num === null || num === undefined) return "0";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatCurrency(amount, currency = "USD") {
  if (amount === null || amount === undefined) return "$0.00";
  return `$${parseFloat(amount).toFixed(2)}`;
}

export function shortenAddress(address) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function isValidAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
