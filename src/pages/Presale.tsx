import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ethers } from "ethers";
import {
  Wallet, ArrowRight, Shield, Zap, TrendingUp, Clock,
  CheckCircle, AlertTriangle, ExternalLink, Copy, Loader2,
  ChevronRight, Globe, Lock, Users, Target, Sparkles,
  Vote, Crown, ArrowDown, Flame, Star, Gift, Info, CircleDollarSign,
  Coins, ArrowLeftRight, Bot, CreditCard
} from "lucide-react";
import { useWallet } from "@/lib/walletContext";
import {
  PRESALE_CONFIG, CONTRACT_ADDRESSES, BSC_CHAIN_ID, ETH_CHAIN_ID,
  CHAIN_CONFIG, FUND_DISTRIBUTION, getExplorerUrl, shortenAddress, formatTokenAmount
} from "@/lib/web3Config";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const PRICES_USD: Record<string, number> = {
  BNB: 600,
  ETH: 3200,
  USDT: 1,
  BTC: 95000,
};

const MIN_USD = PRESALE_CONFIG.minBuyUSD;
const DAO_FEE_USD = 5;

type PayToken = "BNB" | "USDT" | "ETH" | "BTC";
type DaoPayToken = "USDT" | "BNB" | "BTC" | "ETH";

const TOKEN_INFO: Record<PayToken, { color: string; chain: string; chainId: number }> = {
  BNB: { color: "text-yellow-400", chain: "BSC", chainId: BSC_CHAIN_ID },
  USDT: { color: "text-emerald-400", chain: "BSC / ETH", chainId: BSC_CHAIN_ID },
  ETH: { color: "text-blue-400", chain: "Ethereum", chainId: ETH_CHAIN_ID },
  BTC: { color: "text-orange-400", chain: "Bitcoin Network", chainId: BSC_CHAIN_ID },
};

const PRESALE_END_DATE = new Date("2026-03-15T23:59:59Z");

function CountdownTimer() {
  const { t } = useTranslation();
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calcTime = () => {
      const now = new Date().getTime();
      const end = PRESALE_END_DATE.getTime();
      const diff = Math.max(0, end - now);
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      };
    };
    setTime(calcTime());
    const interval = setInterval(() => setTime(calcTime()), 1000);
    return () => clearInterval(interval);
  }, []);

  const labelMap: Record<string, string> = {
    days: t("presale.days", "days"),
    hours: t("presale.hours", "hours"),
    minutes: t("presale.minutes", "minutes"),
    seconds: t("presale.seconds", "seconds"),
  };

  return (
    <div className="flex gap-2 sm:gap-3 justify-center">
      {Object.entries(time).map(([label, value]) => (
        <div key={label} className="text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-slate-900/80 border border-cyan-500/20 rounded-xl flex items-center justify-center mb-1">
            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-mono">{String(value).padStart(2, "0")}</span>
          </div>
          <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider">{labelMap[label]}</span>
        </div>
      ))}
    </div>
  );
}

function PresaleHero() {
  const { t } = useTranslation();
  return (
    <div className="text-center max-w-4xl mx-auto mb-16">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6">
          <Flame className="w-4 h-4 text-orange-400" />
          {t("presale.stageLive", "Stage 1 - LIVE NOW")}
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-7xl font-bold text-white mb-6 font-display leading-tight" data-testid="text-presale-title">
          AIDAG Token{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-500">
            {t("presale.title", "Presale")}
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-slate-400 mb-8 max-w-2xl mx-auto px-2">
          {t("presale.heroDesc", "The world's first quantum-secure token sale. Buy AIDAG with BNB, USDT, or ETH.")}
          Minimum purchase: <span className="text-cyan-400 font-bold">${MIN_USD} USD</span>. All transactions processed by SoulwareAI.
        </p>

        <div className="mb-8">
          <p className="text-sm text-slate-400 mb-3">{t("presale.stageEndsIn", "Stage 1 ends in:")}</p>
          <CountdownTimer />
        </div>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
            <Shield className="w-4 h-4" />
            {t("presale.contractVerified", "Contract Verified")}
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-medium">
            <CircleDollarSign className="w-4 h-4" />
            Min. ${MIN_USD} USD
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium">
            <ArrowLeftRight className="w-4 h-4" />
            BNB / USDT / ETH / BTC
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function PriceStages() {
  const { t } = useTranslation();
  const listingPrice = PRESALE_CONFIG.listingPrice;
  const stage1Discount = Math.round(((listingPrice - PRESALE_CONFIG.stage1Price) / listingPrice) * 100);
  const stage2Discount = Math.round(((listingPrice - PRESALE_CONFIG.stage2Price) / listingPrice) * 100);
  const halfAllocation = Math.floor(PRESALE_CONFIG.presaleTarget / 2);
  const allocationFormatted = halfAllocation.toLocaleString();

  const stages = [
    { name: "Stage 1", price: PRESALE_CONFIG.stage1Price, status: "active", bonus: `${stage1Discount}% Discount`, allocation: `${allocationFormatted} AIDAG`, color: "cyan" },
    { name: "Stage 2", price: PRESALE_CONFIG.stage2Price, status: "upcoming", bonus: `${stage2Discount}% Discount`, allocation: `${allocationFormatted} AIDAG`, color: "purple" },
    { name: "Listing", price: PRESALE_CONFIG.listingPrice, status: "future", bonus: t("presale.fullPrice", "Full Price"), allocation: t("presale.exchangeLaunch", "Exchange Launch"), color: "emerald" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-12">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
        {stages.map((stage, i) => (
          <div key={i} className={`relative glass-card rounded-2xl p-6 border ${
            stage.status === "active" ? "border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.15)]" : "border-white/5"
          }`}>
            {stage.status === "active" && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full text-xs font-bold text-white whitespace-nowrap">
                {t("presale.currentStageLabel", "CURRENT STAGE")}
              </div>
            )}
            <div className="text-center pt-2">
              <h3 className="text-lg font-bold text-white mb-2">{stage.name}</h3>
              <div className={`text-3xl sm:text-4xl font-bold font-display mb-2 ${
                stage.status === "active" ? "text-cyan-400" : "text-slate-400"
              }`}>${stage.price}</div>
              <div className="text-xs text-slate-400 mb-3">{t("presale.perAidagToken", "per AIDAG token")}</div>
              <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                stage.status === "active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-white/5 text-slate-400"
              }`}>
                {stage.status === "active" ? <Star className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                {stage.bonus}
              </div>
              <div className="text-xs text-slate-500 mt-2">{stage.allocation}</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function PresaleProgress() {
  const { t } = useTranslation();
  const sold = 0;
  const target = PRESALE_CONFIG.presaleTarget;
  const percentage = target > 0 ? (sold / target) * 100 : 0;
  const raised = sold * PRESALE_CONFIG.stage1Price;
  const holders = 0;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-5 sm:p-8 border border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.1)]">
      <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8 flex-wrap">
        <div>
          <div className="text-xs text-cyan-400 font-bold uppercase tracking-widest mb-1">{t("presale.presaleProgress", "Presale Progress")}</div>
          <div className="text-2xl sm:text-3xl font-bold text-white font-display">{percentage.toFixed(1)}%</div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 text-sm font-bold">{t("presale.live", "LIVE")}</span>
        </div>
      </div>

      <div className="mb-8">
        <div className="w-full h-6 bg-slate-800 rounded-full overflow-hidden relative">
          <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-cyan-500 via-emerald-500 to-cyan-400 rounded-full relative">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-pulse" />
          </motion.div>
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
            <span className="text-xs font-bold text-white drop-shadow-lg">{formatTokenAmount(sold)} / {formatTokenAmount(target)} AIDAG</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { icon: <TrendingUp className="w-4 sm:w-5 h-4 sm:h-5 text-cyan-400" />, label: t("presale.tokensSold", "Tokens Sold"), value: formatTokenAmount(sold), color: "text-white" },
          { icon: <Target className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-400" />, label: t("presale.totalRaised", "Total Raised"), value: `$${formatTokenAmount(raised)}`, color: "text-emerald-400" },
          { icon: <Users className="w-4 sm:w-5 h-4 sm:h-5 text-purple-400" />, label: t("presale.tokenHolders", "Token Holders"), value: holders.toLocaleString(), color: "text-white" },
          { icon: <Zap className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-400" />, label: t("presale.price", "Price"), value: `$${PRESALE_CONFIG.stage1Price}`, color: "text-cyan-400" },
        ].map((s, i) => (
          <div key={i} className="p-3 sm:p-4 bg-slate-900/60 rounded-xl border border-white/5 text-center">
            <div className="mx-auto mb-1 sm:mb-2 flex justify-center">{s.icon}</div>
            <div className="text-[10px] sm:text-xs text-slate-400 mb-1">{s.label}</div>
            <div className={`text-sm sm:text-lg font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/10">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-yellow-400/80">
            <span className="font-bold text-yellow-400">{t("presale.minimumPurchaseNote", "Minimum Purchase")}:</span> $50 USD {t("presale.minimumPurchaseDesc", "equivalent in BNB, USDT, or ETH. All payments accepted on BSC and Ethereum networks.")}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

type FlowStep = "dao-ask" | "dao-pay" | "buy" | "combined";

function BuyForm() {
  const { t } = useTranslation();
  const wallet = useWallet();

  const [step, setStep] = useState<FlowStep>("dao-ask");
  const [wantDao, setWantDao] = useState<boolean | null>(null);
  const [daoPayToken, setDaoPayToken] = useState<DaoPayToken>("USDT");
  const [daoComplete, setDaoComplete] = useState(false);
  const [daoProcessing, setDaoProcessing] = useState(false);

  const [payToken, setPayToken] = useState<PayToken>("BNB");
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [txStep, setTxStep] = useState<"idle" | "dao" | "founder" | "liquidity" | "usdt-approve" | "usdt-founder" | "usdt-liquidity" | "done">("idle");

  const [combinedMode, setCombinedMode] = useState(false);

  const priceUSD = PRICES_USD[payToken];
  const usdValue = amount ? parseFloat(amount) * priceUSD : 0;
  const tokensToReceive = usdValue / PRESALE_CONFIG.stage1Price;
  const minAmount = (MIN_USD / priceUSD);
  const isBelowMin = amount !== "" && usdValue < MIN_USD && usdValue > 0;

  const daoFeeInToken = (token: DaoPayToken) => (DAO_FEE_USD / PRICES_USD[token]);

  const quickAmounts: Record<PayToken, number[]> = {
    BNB: [0.1, 0.5, 1, 5, 10],
    USDT: [50, 100, 250, 500, 1000],
    ETH: [0.02, 0.05, 0.1, 0.5, 1],
    BTC: [0.001, 0.005, 0.01, 0.05, 0.1],
  };

  const handleDaoPayment = async (token: DaoPayToken) => {
    if (!wallet.signer) return;
    setDaoProcessing(true);
    setError(null);
    setDaoPayToken(token);

    try {
      const feeAmount = daoFeeInToken(token);

      if (token === "USDT") {
        const usdtContracts: Record<number, string> = {
          56: "0x55d398326f99059fF775485246999027B3197955",
          1: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        };
        const chainId = wallet.chainId || BSC_CHAIN_ID;
        const usdtAddress = usdtContracts[chainId];
        if (!usdtAddress) { setError("USDT not supported on this chain"); setDaoProcessing(false); return; }

        const usdtAbi = [
          "function approve(address spender, uint256 amount) returns (bool)",
          "function transfer(address to, uint256 amount) returns (bool)",
          "function decimals() view returns (uint8)",
        ];
        const usdtContract = new ethers.Contract(usdtAddress, usdtAbi, wallet.signer);
        const decimals = chainId === 1 ? 6 : 18;
        const parsed = ethers.parseUnits(feeAmount.toFixed(decimals), decimals);

        const approveTx = await usdtContract.approve(CONTRACT_ADDRESSES.founderWallet, parsed);
        await approveTx.wait();
        const transferTx = await usdtContract.transfer(CONTRACT_ADDRESSES.founderWallet, parsed);
        await transferTx.wait();
      } else if (token === "BNB" || token === "ETH") {
        const tx = await wallet.signer.sendTransaction({
          to: CONTRACT_ADDRESSES.founderWallet,
          value: ethers.parseEther(feeAmount.toFixed(18)),
        });
        await tx.wait();
      } else if (token === "BTC") {
        const wbtcContracts: Record<number, string> = {
          56: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
          1: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
        };
        const chainId = wallet.chainId || BSC_CHAIN_ID;
        const wbtcAddress = wbtcContracts[chainId];
        if (!wbtcAddress) { setError("BTC (WBTC) not supported on this chain"); setDaoProcessing(false); return; }

        const wbtcAbi = [
          "function approve(address spender, uint256 amount) returns (bool)",
          "function transfer(address to, uint256 amount) returns (bool)",
          "function decimals() view returns (uint8)",
        ];
        const wbtcContract = new ethers.Contract(wbtcAddress, wbtcAbi, wallet.signer);
        const decimals = chainId === 1 ? 8 : 18;
        const parsed = ethers.parseUnits(feeAmount.toFixed(decimals), decimals);

        const approveTx = await wbtcContract.approve(CONTRACT_ADDRESSES.founderWallet, parsed);
        await approveTx.wait();
        const transferTx = await wbtcContract.transfer(CONTRACT_ADDRESSES.founderWallet, parsed);
        await transferTx.wait();
      }

      setDaoComplete(true);
      setStep("buy");
    } catch (err: any) {
      if (err.code === "ACTION_REJECTED") setError("Transaction cancelled");
      else setError("DAO membership payment failed. Please try again.");
    } finally {
      setDaoProcessing(false);
    }
  };

  const handleBuy = async () => {
    if (!wallet.signer || !amount) return;

    if (usdValue < MIN_USD) {
      setError(`Minimum purchase is $${MIN_USD} USD. Current value: $${usdValue.toFixed(2)} USD.`);
      return;
    }

    setIsProcessing(true);
    setError(null);
    setTxHash(null);

    try {
      if (combinedMode && !daoComplete) {
        setTxStep("dao");
        const daoFee = daoFeeInToken(payToken as DaoPayToken);

        if (payToken === "USDT") {
          const usdtContracts: Record<number, string> = {
            56: "0x55d398326f99059fF775485246999027B3197955",
            1: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
          };
          const chainId = wallet.chainId || BSC_CHAIN_ID;
          const usdtAddress = usdtContracts[chainId];
          if (!usdtAddress) { setError("USDT not supported on this chain"); return; }
          const usdtAbi = [
            "function approve(address spender, uint256 amount) returns (bool)",
            "function transfer(address to, uint256 amount) returns (bool)",
          ];
          const usdtContract = new ethers.Contract(usdtAddress, usdtAbi, wallet.signer);
          const decimals = chainId === 1 ? 6 : 18;
          const parsed = ethers.parseUnits(daoFee.toFixed(decimals), decimals);
          const approveTx = await usdtContract.approve(CONTRACT_ADDRESSES.founderWallet, parsed);
          await approveTx.wait();
          const transferTx = await usdtContract.transfer(CONTRACT_ADDRESSES.founderWallet, parsed);
          await transferTx.wait();
        } else if (payToken === "BTC") {
          const wbtcContracts: Record<number, string> = {
            56: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
            1: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
          };
          const chainId = wallet.chainId || BSC_CHAIN_ID;
          const wbtcAddress = wbtcContracts[chainId];
          if (!wbtcAddress) { setError("BTC (WBTC) not supported on this chain"); return; }
          const wbtcAbi = [
            "function approve(address spender, uint256 amount) returns (bool)",
            "function transfer(address to, uint256 amount) returns (bool)",
          ];
          const wbtcContract = new ethers.Contract(wbtcAddress, wbtcAbi, wallet.signer);
          const decimals = chainId === 1 ? 8 : 18;
          const parsed = ethers.parseUnits(daoFee.toFixed(decimals), decimals);
          const approveTx = await wbtcContract.approve(CONTRACT_ADDRESSES.founderWallet, parsed);
          await approveTx.wait();
          const transferTx = await wbtcContract.transfer(CONTRACT_ADDRESSES.founderWallet, parsed);
          await transferTx.wait();
        } else {
          const tx = await wallet.signer.sendTransaction({
            to: CONTRACT_ADDRESSES.founderWallet,
            value: ethers.parseEther(daoFee.toFixed(18)),
          });
          await tx.wait();
        }
        setDaoComplete(true);
      }

      if (payToken === "USDT") {
        const usdtContracts: Record<number, string> = {
          56: "0x55d398326f99059fF775485246999027B3197955",
          1: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        };
        const chainId = wallet.chainId || BSC_CHAIN_ID;
        const usdtAddress = usdtContracts[chainId];
        if (!usdtAddress) { setError("USDT not supported on this chain"); return; }

        const usdtAbi = [
          "function approve(address spender, uint256 amount) returns (bool)",
          "function transfer(address to, uint256 amount) returns (bool)",
        ];
        const usdtContract = new ethers.Contract(usdtAddress, usdtAbi, wallet.signer);
        const decimals = chainId === 1 ? 6 : 18;
        const totalParsed = ethers.parseUnits(amount, decimals);
        const founderAmount = (totalParsed * BigInt(FUND_DISTRIBUTION.founder)) / BigInt(100);
        const liquidityAmount = totalParsed - founderAmount;

        setTxStep("usdt-approve");
        const approveTx = await usdtContract.approve(CONTRACT_ADDRESSES.founderWallet, totalParsed);
        await approveTx.wait();

        setTxStep("usdt-founder");
        const founderTx = await usdtContract.transfer(CONTRACT_ADDRESSES.founderWallet, founderAmount);
        await founderTx.wait();

        setTxStep("usdt-liquidity");
        const approveL = await usdtContract.approve(CONTRACT_ADDRESSES.liquidityWallet, liquidityAmount);
        await approveL.wait();
        const liqTx = await usdtContract.transfer(CONTRACT_ADDRESSES.liquidityWallet, liquidityAmount);
        setTxHash(liqTx.hash);
        await liqTx.wait();
      } else if (payToken === "BTC") {
        const wbtcContracts: Record<number, string> = {
          56: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
          1: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
        };
        const chainId = wallet.chainId || BSC_CHAIN_ID;
        const wbtcAddress = wbtcContracts[chainId];
        if (!wbtcAddress) { setError("BTC (WBTC) not supported on this chain"); return; }

        const wbtcAbi = [
          "function approve(address spender, uint256 amount) returns (bool)",
          "function transfer(address to, uint256 amount) returns (bool)",
        ];
        const wbtcContract = new ethers.Contract(wbtcAddress, wbtcAbi, wallet.signer);
        const decimals = chainId === 1 ? 8 : 18;
        const totalParsed = ethers.parseUnits(amount, decimals);
        const founderAmount = (totalParsed * BigInt(FUND_DISTRIBUTION.founder)) / BigInt(100);
        const liquidityAmount = totalParsed - founderAmount;

        setTxStep("usdt-approve");
        const approveTx = await wbtcContract.approve(CONTRACT_ADDRESSES.founderWallet, totalParsed);
        await approveTx.wait();

        setTxStep("usdt-founder");
        const founderTx = await wbtcContract.transfer(CONTRACT_ADDRESSES.founderWallet, founderAmount);
        await founderTx.wait();

        setTxStep("usdt-liquidity");
        const approveL = await wbtcContract.approve(CONTRACT_ADDRESSES.liquidityWallet, liquidityAmount);
        await approveL.wait();
        const liqTx = await wbtcContract.transfer(CONTRACT_ADDRESSES.liquidityWallet, liquidityAmount);
        setTxHash(liqTx.hash);
        await liqTx.wait();
      } else {
        const totalWei = ethers.parseEther(amount);
        const founderWei = (totalWei * BigInt(FUND_DISTRIBUTION.founder)) / BigInt(100);
        const liquidityWei = totalWei - founderWei;

        setTxStep("founder");
        const founderTx = await wallet.signer.sendTransaction({
          to: CONTRACT_ADDRESSES.founderWallet,
          value: founderWei,
        });
        await founderTx.wait();

        setTxStep("liquidity");
        const liqTx = await wallet.signer.sendTransaction({
          to: CONTRACT_ADDRESSES.liquidityWallet,
          value: liquidityWei,
        });
        setTxHash(liqTx.hash);
        await liqTx.wait();
      }

      setTxStep("done");
    } catch (err: any) {
      console.error("Transaction error:", err);
      if (err.code === "ACTION_REJECTED") setError("Transaction cancelled");
      else setError("Transaction failed. Please ensure you have sufficient balance and try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10">
      <div className="flex gap-4 mb-8">
        {(["BNB", "USDT", "ETH", "BTC"] as PayToken[]).map((token) => (
          <button
            key={token}
            onClick={() => { setPayToken(token); setAmount(""); setError(null); }}
            className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
              payToken === token 
                ? "bg-cyan-500/10 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]" 
                : "bg-white/5 border-white/5 hover:border-white/20"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
              <span className={`text-sm font-bold ${TOKEN_INFO[token].color}`}>{token[0]}</span>
            </div>
            <span className="text-xs font-bold text-white">{token}</span>
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2 block">
            {t("presale.amountToPay", "Amount to Pay")}
          </label>
          <div className="relative group">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-4 text-xl font-bold text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-700"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="text-sm font-bold text-slate-500">{payToken}</span>
              <button
                onClick={() => setAmount(minAmount.toFixed(4))}
                className="text-[10px] px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors"
              >
                MIN
              </button>
            </div>
          </div>
          {isBelowMin && (
            <p className="text-[10px] text-red-400 mt-2 font-medium flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Minimum purchase is ${MIN_USD} USD ({minAmount.toFixed(4)} {payToken})
            </p>
          )}
        </div>

        <div className="p-4 bg-white/5 rounded-xl space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">{t("presale.receiveAmount", "You will receive")}</span>
            <span className="text-white font-bold">{tokensToReceive.toLocaleString(undefined, { maximumFractionDigits: 0 })} AIDAG</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">{t("presale.estimatedValue", "USD Value")}</span>
            <span className="text-cyan-400 font-bold">${usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-xs text-red-400 leading-relaxed">{error}</p>
          </div>
        )}

        {txHash && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-emerald-400 font-bold">Transaction Submitted</span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <a
              href={getExplorerUrl(wallet.chainId || BSC_CHAIN_ID, txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-emerald-400/70 hover:underline flex items-center gap-1 break-all"
            >
              {txHash} <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        )}

        <button
          onClick={handleBuy}
          disabled={!amount || isProcessing || isBelowMin}
          className="w-full py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {txStep === "dao" ? "Paying DAO Fee..." : 
               txStep === "usdt-approve" ? "Approving USDT..." :
               txStep === "usdt-founder" ? "Processing Part 1..." :
               txStep === "usdt-liquidity" ? "Finalizing..." :
               txStep === "founder" ? "Processing Part 1..." :
               txStep === "liquidity" ? "Finalizing..." :
               "Processing..."}
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              {combinedMode && !daoComplete ? "Join DAO + Buy AIDAG" : t("presale.buyNow", "Buy AIDAG Now")}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function Presale() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30">
      <Navigation />
      <main className="pt-32 pb-24 px-4 sm:px-6">
        <div className="container mx-auto">
          <PresaleHero />
          <PriceStages />
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto items-start">
            <BuyForm />
            <PresaleProgress />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
