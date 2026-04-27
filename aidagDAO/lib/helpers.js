export function shortenAddress(address, startChars = 6, endChars = 4) {
  if (!address) return "";
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

export function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString("en-US", { 
    month: "short", 
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined
  });
}

export function formatBNB(value, decimals = 4) {
  const num = parseFloat(value);
  if (isNaN(num)) return "0";
  return num.toFixed(decimals);
}

export function formatUSD(value) {
  const num = parseFloat(value);
  if (isNaN(num)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
}

export function validateWalletAddress(address) {
  if (!address) return { valid: false, error: "Wallet address is required" };
  if (!address.startsWith("0x")) return { valid: false, error: "Address must start with 0x" };
  if (address.length !== 42) return { valid: false, error: "Address must be 42 characters" };
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) return { valid: false, error: "Invalid address format" };
  return { valid: true, error: null };
}

export function validateAmount(amount, minAmount = 0.001, maxAmount = 100) {
  const num = parseFloat(amount);
  if (isNaN(num) || num <= 0) return { valid: false, error: "Please enter a valid amount" };
  if (num < minAmount) return { valid: false, error: `Minimum amount is ${minAmount} BNB` };
  if (num > maxAmount) return { valid: false, error: `Maximum amount is ${maxAmount} BNB` };
  return { valid: true, error: null };
}

export const TX_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  FAILED: "failed"
};

export const MEMBER_TYPES = {
  DAO: "dao",
  HOLDER: "holder",
  FOUNDER: "founder"
};
