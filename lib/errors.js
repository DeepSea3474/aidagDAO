import React from "react";

export const ERROR_CODES = {
  INSUFFICIENT_BALANCE: "INSUFFICIENT_BALANCE",
  WRONG_NETWORK: "WRONG_NETWORK",
  CONTRACT_NOT_FOUND: "CONTRACT_NOT_FOUND",
  USER_REJECTED: "USER_REJECTED",
  TRANSACTION_FAILED: "TRANSACTION_FAILED",
  GAS_ESTIMATION_FAILED: "GAS_ESTIMATION_FAILED",
  NO_WALLET: "NO_WALLET",
  UNKNOWN: "UNKNOWN",
};

export const ERROR_MESSAGES = {
  [ERROR_CODES.INSUFFICIENT_BALANCE]: "Yetersiz bakiye. Lütfen hesabınıza yeterli BNB ekleyin.",
  [ERROR_CODES.WRONG_NETWORK]: "Yanlış ağ seçildi. Lütfen Binance Smart Chain (BSC) ağına geçin.",
  [ERROR_CODES.CONTRACT_NOT_FOUND]: "Kontrat adresi bulunamadı. Lütfen yapılandırmayı kontrol edin.",
  [ERROR_CODES.USER_REJECTED]: "İşlem kullanıcı tarafından reddedildi.",
  [ERROR_CODES.TRANSACTION_FAILED]: "İşlem başarısız oldu. Lütfen tekrar deneyin.",
  [ERROR_CODES.GAS_ESTIMATION_FAILED]: "Gas tahmini başarısız. İşlem gerçekleştirilemeyebilir.",
  [ERROR_CODES.NO_WALLET]: "MetaMask veya uyumlu bir cüzdan bulunamadı.",
  [ERROR_CODES.UNKNOWN]: "Bilinmeyen bir hata oluştu. Lütfen tekrar deneyin.",
};

export function parseError(error) {
  if (!error) return { code: ERROR_CODES.UNKNOWN, message: ERROR_MESSAGES[ERROR_CODES.UNKNOWN] };
  
  const errorMessage = error.message?.toLowerCase() || "";
  const errorCode = error.code;
  
  if (errorCode === 4001 || errorMessage.includes("user rejected") || errorMessage.includes("user denied")) {
    return { code: ERROR_CODES.USER_REJECTED, message: ERROR_MESSAGES[ERROR_CODES.USER_REJECTED] };
  }
  
  if (errorMessage.includes("insufficient") || errorMessage.includes("balance")) {
    return { code: ERROR_CODES.INSUFFICIENT_BALANCE, message: ERROR_MESSAGES[ERROR_CODES.INSUFFICIENT_BALANCE] };
  }
  
  if (errorMessage.includes("network") || errorMessage.includes("chain")) {
    return { code: ERROR_CODES.WRONG_NETWORK, message: ERROR_MESSAGES[ERROR_CODES.WRONG_NETWORK] };
  }
  
  if (errorMessage.includes("contract") || errorMessage.includes("address")) {
    return { code: ERROR_CODES.CONTRACT_NOT_FOUND, message: ERROR_MESSAGES[ERROR_CODES.CONTRACT_NOT_FOUND] };
  }
  
  if (errorMessage.includes("gas") || errorMessage.includes("estimation")) {
    return { code: ERROR_CODES.GAS_ESTIMATION_FAILED, message: ERROR_MESSAGES[ERROR_CODES.GAS_ESTIMATION_FAILED] };
  }
  
  if (errorMessage.includes("failed") || errorMessage.includes("reverted")) {
    return { code: ERROR_CODES.TRANSACTION_FAILED, message: ERROR_MESSAGES[ERROR_CODES.TRANSACTION_FAILED] };
  }
  
  return { code: ERROR_CODES.UNKNOWN, message: error.message || ERROR_MESSAGES[ERROR_CODES.UNKNOWN] };
}

export function ErrorAlert({ error, onDismiss }) {
  if (!error) return null;
  
  const { message } = typeof error === "string" ? { message: error } : parseError(error);
  
  return React.createElement("div", {
    className: "bg-red-900/20 border border-red-600/30 text-red-400 p-4 rounded-lg flex items-start gap-3"
  }, [
    React.createElement("span", { key: "icon", className: "text-xl" }, "⚠️"),
    React.createElement("div", { key: "content", className: "flex-1" }, [
      React.createElement("p", { key: "title", className: "font-medium" }, "Hata"),
      React.createElement("p", { key: "message", className: "text-sm text-red-300" }, message)
    ]),
    onDismiss && React.createElement("button", { 
      key: "dismiss",
      onClick: onDismiss, 
      className: "text-red-400 hover:text-red-300" 
    }, "✕")
  ]);
}

export function SuccessAlert({ message, txHash, onDismiss }) {
  if (!message) return null;
  
  return React.createElement("div", {
    className: "bg-green-900/20 border border-green-600/30 text-green-400 p-4 rounded-lg flex items-start gap-3"
  }, [
    React.createElement("span", { key: "icon", className: "text-xl" }, "✅"),
    React.createElement("div", { key: "content", className: "flex-1" }, [
      React.createElement("p", { key: "title", className: "font-medium" }, "Başarılı"),
      React.createElement("p", { key: "message", className: "text-sm text-green-300" }, message),
      txHash && React.createElement("a", { 
        key: "link",
        href: `https://bscscan.com/tx/${txHash}`, 
        target: "_blank", 
        rel: "noopener noreferrer",
        className: "text-cyan-400 text-sm hover:underline mt-1 inline-block"
      }, "BSCScan'da Görüntüle →")
    ]),
    onDismiss && React.createElement("button", { 
      key: "dismiss",
      onClick: onDismiss, 
      className: "text-green-400 hover:text-green-300" 
    }, "✕")
  ]);
}
