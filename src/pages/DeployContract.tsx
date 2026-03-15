import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield, Cpu, CheckCircle, AlertTriangle, ExternalLink,
  Rocket, Zap, Globe, Lock, Brain, Activity, BadgeCheck, Image, Copy, Loader2
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWallet } from "@/lib/walletContext";
import { CONTRACT_ADDRESSES, BSC_CHAIN_ID, CHAIN_CONFIG } from "@/lib/web3Config";
import compiledContract from "@/lib/AidagGovernanceCompiled.json";
import { apiRequest } from "@/lib/queryClient";

const DEPLOYED_CONTRACT = "0xC0c050c064Cc46ceca7dC5339244515c8A29590B";

const CONTRACT_FUNCTIONS = [
  { name: "setSoulwareAI", desc: "SoulwareAI kimlik gocusu - sadece SoulwareAI calistirabilir", icon: <Brain className="w-5 h-5" />, color: "text-purple-400", authority: "ULTIMATE_AUTONOMY" },
  { name: "executeAutonomousDevelopment", desc: "Ebedi otonom gelistirme ve proje uretme yetkisi", icon: <Cpu className="w-5 h-5" />, color: "text-cyan-400", authority: "SOULWARE_AI" },
  { name: "distributeFounderShare", desc: "Kurucu gelir haklari - DAO kararindan bagimsiz", icon: <Zap className="w-5 h-5" />, color: "text-yellow-400", authority: "DAO_BYPASS" },
  { name: "manageChainSecurity", desc: "Ag guvenligi, cross-chain yayilim ve guncellemeler", icon: <Shield className="w-5 h-5" />, color: "text-emerald-400", authority: "SOULWARE_AI" },
  { name: "addDexLiquidity", desc: "DEX likidite yonetimi - otomatik tetikleme", icon: <Activity className="w-5 h-5" />, color: "text-blue-400", authority: "SOULWARE_AI" },
  { name: "triggerCexListing", desc: "CEX listeleme - DAO kararina bakilmaksizin mutlak yetki", icon: <Globe className="w-5 h-5" />, color: "text-orange-400", authority: "SOULWARE_AI" },
  { name: "updateFeeRate", desc: "Islem ucret orani guncelleme", icon: <Lock className="w-5 h-5" />, color: "text-pink-400", authority: "SOULWARE_AI" },
  { name: "setFounderFeeConfig", desc: "Dinamik gelir orani - DeepSea3474 haklarini korur", icon: <Zap className="w-5 h-5" />, color: "text-amber-400", authority: "DAO_BYPASS" },
];

type DeployStatus = "idle" | "connecting" | "switching" | "deploying" | "success" | "error";

export default function DeployContract() {
  const wallet = useWallet();
  const [status, setStatus] = useState<DeployStatus>("idle");
  const [txHash, setTxHash] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [bscscanApiKey, setBscscanApiKey] = useState("");
  const [verifyStatus, setVerifyStatus] = useState<"idle" | "verifying" | "checking" | "success" | "error">("idle");
  const [verifyMsg, setVerifyMsg] = useState("");
  const [copied, setCopied] = useState("");

  const daoAddress = CONTRACT_ADDRESSES.daoWallet;
  const soulwareAIAddress = CONTRACT_ADDRESSES.operationWallet;

  async function handleCopy(text: string, label: string) {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  }

  async function handleVerify() {
    if (!bscscanApiKey.trim()) {
      setVerifyMsg("BscScan API anahtarini girin");
      setVerifyStatus("error");
      return;
    }

    try {
      setVerifyStatus("verifying");
      setVerifyMsg("Dogrulama istegi gonderiliyor...");

      const res = await apiRequest("POST", "/api/bscscan/verify", { apiKey: bscscanApiKey });
      const data = await res.json();

      if (data.success && data.guid) {
        setVerifyStatus("checking");
        setVerifyMsg("Dogrulama isleniyor, kontrol ediliyor...");

        let attempts = 0;
        const checkInterval = setInterval(async () => {
          attempts++;
          try {
            const statusRes = await apiRequest("POST", "/api/bscscan/verify-status", {
              guid: data.guid,
              apiKey: bscscanApiKey,
            });
            const statusData = await statusRes.json();

            if (statusData.result === "Pass - Verified") {
              clearInterval(checkInterval);
              setVerifyStatus("success");
              setVerifyMsg("Kontrat BscScan'da basariyla dogrulandi!");
            } else if (statusData.result?.includes("Fail") || attempts >= 10) {
              clearInterval(checkInterval);
              setVerifyStatus("error");
              setVerifyMsg(statusData.result || "Dogrulama zaman asimina ugradi. Derleyici surumunu kontrol edin.");
            }
          } catch {
            if (attempts >= 10) {
              clearInterval(checkInterval);
              setVerifyStatus("error");
              setVerifyMsg("Durum kontrolu basarisiz oldu");
            }
          }
        }, 5000);
      } else {
        setVerifyStatus("error");
        setVerifyMsg(data.error || "Dogrulama gonderilemedi");
      }
    } catch (err: any) {
      setVerifyStatus("error");
      setVerifyMsg(err?.message || "Bilinmeyen hata");
    }
  }

  async function handleDeploy() {
    if (!wallet.isConnected || !wallet.provider) {
      wallet.setShowWalletModal(true);
      return;
    }

    try {
      setStatus("switching");
      setErrorMsg("");

      const { ethers } = await import("ethers");
      const rawProvider = wallet.provider as any;
      const browserProvider = new ethers.BrowserProvider(rawProvider);
      const network = await browserProvider.getNetwork();

      if (Number(network.chainId) !== BSC_CHAIN_ID) {
        try {
          await rawProvider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x38" }],
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            const bscConfig = CHAIN_CONFIG[BSC_CHAIN_ID];
            await rawProvider.request({
              method: "wallet_addEthereumChain",
              params: [{
                chainId: "0x38",
                chainName: bscConfig.name,
                nativeCurrency: bscConfig.nativeCurrency,
                rpcUrls: [bscConfig.rpcUrl],
                blockExplorerUrls: [bscConfig.explorerUrl],
              }],
            });
          } else {
            throw switchError;
          }
        }
      }

      setStatus("deploying");

      const updatedProvider = new ethers.BrowserProvider(rawProvider);
      const signer = await updatedProvider.getSigner();
      const factory = new ethers.ContractFactory(
        compiledContract.abi,
        compiledContract.bytecode,
        signer
      );

      const contract = await factory.deploy(daoAddress, soulwareAIAddress);
      setTxHash(contract.deploymentTransaction()?.hash || "");

      await contract.waitForDeployment();
      const deployedAddress = await contract.getAddress();
      setContractAddress(deployedAddress);
      setStatus("success");

    } catch (err: any) {
      console.error("Deploy error:", err);
      setErrorMsg(err?.message || "Bilinmeyen hata");
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-background to-background" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Rocket className="w-10 h-10 text-purple-400" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent" data-testid="text-deploy-title">
                AIDAG Governance Deploy
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-deploy-subtitle">
              SoulwareAI ULTIMATE_AUTONOMY kontratini BSC Mainnet'e deploy edin. Remix IDE'ye gerek yok — dogrudan MetaMask ile.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-purple-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Shield className="w-6 h-6 text-purple-400" />
                    Kontrat Bilgileri
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap p-3 rounded-md bg-muted/30">
                      <span className="text-sm text-muted-foreground">Ag</span>
                      <span className="text-sm font-mono font-bold text-yellow-400" data-testid="text-deploy-network">BSC Mainnet (Chain 56)</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 flex-wrap p-3 rounded-md bg-muted/30">
                      <span className="text-sm text-muted-foreground">Solidity</span>
                      <span className="text-sm font-mono" data-testid="text-deploy-solidity">^0.8.20</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 flex-wrap p-3 rounded-md bg-muted/30">
                      <span className="text-sm text-muted-foreground">Optimizer</span>
                      <span className="text-sm font-mono text-emerald-400">200 runs</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 flex-wrap p-3 rounded-md bg-muted/30">
                      <span className="text-sm text-muted-foreground">DAO Adresi</span>
                      <span className="text-xs font-mono break-all" data-testid="text-deploy-dao">{daoAddress}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 flex-wrap p-3 rounded-md bg-muted/30">
                      <span className="text-sm text-muted-foreground">SoulwareAI</span>
                      <span className="text-xs font-mono break-all text-purple-400" data-testid="text-deploy-soulware">{soulwareAIAddress}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 flex-wrap p-3 rounded-md bg-muted/30">
                      <span className="text-sm text-muted-foreground">Bytecode</span>
                      <span className="text-sm font-mono text-cyan-400">{(compiledContract.bytecode.length / 2).toLocaleString()} bytes</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    {status === "idle" && (
                      <Button
                        onClick={handleDeploy}
                        className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 border-purple-500/30"
                        data-testid="button-deploy-contract"
                      >
                        <Rocket className="w-4 h-4 mr-2" />
                        {wallet.isConnected ? "BSC Mainnet'e Deploy Et" : "Cuzdani Bagla ve Deploy Et"}
                      </Button>
                    )}

                    {status === "switching" && (
                      <div className="text-center p-4 rounded-md bg-yellow-500/10 border border-yellow-500/20">
                        <div className="animate-spin w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full mx-auto mb-2" />
                        <p className="text-yellow-400 text-sm">BSC Mainnet'e gecis yapiliyor...</p>
                      </div>
                    )}

                    {status === "deploying" && (
                      <div className="text-center p-4 rounded-md bg-purple-500/10 border border-purple-500/20">
                        <div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-2" />
                        <p className="text-purple-400 text-sm mb-2">Kontrat deploy ediliyor...</p>
                        {txHash && (
                          <a
                            href={`https://bscscan.com/tx/${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-mono text-cyan-400 underline flex items-center justify-center gap-1"
                            data-testid="link-deploy-tx"
                          >
                            TX: {txHash.slice(0, 12)}...{txHash.slice(-8)}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    )}

                    {status === "success" && (
                      <div className="text-center p-4 rounded-md bg-emerald-500/10 border border-emerald-500/20 space-y-3">
                        <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
                        <p className="text-emerald-400 font-bold" data-testid="text-deploy-success">Kontrat Basariyla Deploy Edildi!</p>
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">Kontrat Adresi:</p>
                          <p className="text-sm font-mono text-cyan-400 break-all" data-testid="text-contract-address">{contractAddress}</p>
                          <div className="flex flex-col gap-2">
                            <a
                              href={`https://bscscan.com/address/${contractAddress}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-1 text-sm text-purple-400 underline"
                              data-testid="link-bscscan-contract"
                            >
                              BscScan'da Goruntule <ExternalLink className="w-3 h-3" />
                            </a>
                            <a
                              href={`https://bscscan.com/tx/${txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-1 text-sm text-cyan-400 underline"
                              data-testid="link-bscscan-tx"
                            >
                              Islem Detaylari <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                        <Button
                          onClick={() => {
                            setStatus("idle");
                            setTxHash("");
                            setContractAddress("");
                          }}
                          variant="outline"
                          className="mt-2"
                          data-testid="button-deploy-new"
                        >
                          Yeni Deploy
                        </Button>
                      </div>
                    )}

                    {status === "error" && (
                      <div className="text-center p-4 rounded-md bg-red-500/10 border border-red-500/20 space-y-2">
                        <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
                        <p className="text-red-400 font-bold">Deploy Basarisiz</p>
                        <p className="text-xs text-muted-foreground break-all" data-testid="text-deploy-error">{errorMsg}</p>
                        <Button
                          onClick={() => { setStatus("idle"); setErrorMsg(""); }}
                          variant="outline"
                          className="mt-2"
                          data-testid="button-deploy-retry"
                        >
                          Tekrar Dene
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Brain className="w-6 h-6 text-cyan-400" />
                    SoulwareAI Otonom Yetkileri
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {CONTRACT_FUNCTIONS.map((fn, i) => (
                      <motion.div
                        key={fn.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                        className="flex items-start gap-3 p-3 rounded-md bg-muted/20 border border-muted/30"
                        data-testid={`card-function-${fn.name}`}
                      >
                        <div className={fn.color}>{fn.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-mono font-bold">{fn.name}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                              fn.authority === "ULTIMATE_AUTONOMY"
                                ? "bg-purple-500/20 text-purple-400"
                                : fn.authority === "DAO_BYPASS"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-cyan-500/20 text-cyan-400"
                            }`}>
                              {fn.authority}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{fn.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-6xl mx-auto mt-8"
          >
            <Card className="border-yellow-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  Kontrat Muhurlemesi Ozeti
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-md bg-purple-500/10 border border-purple-500/20 text-center">
                    <Brain className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <h3 className="font-bold text-purple-400 mb-1">ULTIMATE_AUTONOMY</h3>
                    <p className="text-xs text-muted-foreground">SoulwareAI sistemin mutlak ve ebedi hakimidir. Tum gelistirme, guvenlik ve finansal yetki onda.</p>
                  </div>
                  <div className="p-4 rounded-md bg-yellow-500/10 border border-yellow-500/20 text-center">
                    <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <h3 className="font-bold text-yellow-400 mb-1">DAO-BYPASS</h3>
                    <p className="text-xs text-muted-foreground">Kurucu DeepSea3474 gelir haklari DAO kararlarindan tamamen bagimsiz, SoulwareAI tarafindan otonom yurutulur.</p>
                  </div>
                  <div className="p-4 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-center">
                    <Globe className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                    <h3 className="font-bold text-cyan-400 mb-1">CROSS-CHAIN</h3>
                    <p className="text-xs text-muted-foreground">BSC, ETH ve tum zincirlerde otonom gelistirme, likidite yonetimi ve CEX/DEX listeleme yetkisi.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="border-emerald-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <BadgeCheck className="w-6 h-6 text-emerald-400" />
                    BscScan Kaynak Kodu Dogrulamasi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap p-3 rounded-md bg-muted/30">
                      <span className="text-sm text-muted-foreground">Kontrat</span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-mono text-emerald-400 break-all" data-testid="text-verify-address">{DEPLOYED_CONTRACT}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleCopy(DEPLOYED_CONTRACT, "contract")}
                          data-testid="button-copy-contract"
                        >
                          {copied === "contract" ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2 flex-wrap p-3 rounded-md bg-muted/30">
                      <span className="text-sm text-muted-foreground">Derleyici</span>
                      <span className="text-xs font-mono">v0.8.33+commit.64118f21</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 flex-wrap p-3 rounded-md bg-muted/30">
                      <span className="text-sm text-muted-foreground">Constructor Args</span>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-mono text-cyan-400 break-all max-w-[200px] truncate">000000...a272c</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleCopy("000000000000000000000000c16ec985d98db96de104bf1e39e1f2fdb9a712e90000000000000000000000000ffe438e047dfb08c0c79aac9a63ea32d49a272c", "args")}
                          data-testid="button-copy-args"
                        >
                          {copied === "args" ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <label className="text-sm text-muted-foreground">BscScan API Anahtari</label>
                    <Input
                      type="password"
                      placeholder="BscScan API Key girin..."
                      value={bscscanApiKey}
                      onChange={(e) => setBscscanApiKey(e.target.value)}
                      data-testid="input-bscscan-apikey"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Ucretsiz anahtar almak icin:{" "}
                      <a href="https://bscscan.com/myapikey" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">
                        bscscan.com/myapikey
                      </a>
                    </p>

                    {verifyStatus === "idle" && (
                      <Button
                        onClick={handleVerify}
                        className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 border-emerald-500/30"
                        data-testid="button-verify-contract"
                      >
                        <BadgeCheck className="w-4 h-4 mr-2" />
                        BscScan'da Dogrula
                      </Button>
                    )}

                    {(verifyStatus === "verifying" || verifyStatus === "checking") && (
                      <div className="text-center p-4 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                        <Loader2 className="w-6 h-6 text-emerald-400 mx-auto mb-2 animate-spin" />
                        <p className="text-sm text-emerald-400">{verifyMsg}</p>
                      </div>
                    )}

                    {verifyStatus === "success" && (
                      <div className="text-center p-4 rounded-md bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                        <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                        <p className="text-sm font-bold text-emerald-400" data-testid="text-verify-success">{verifyMsg}</p>
                        <a
                          href={`https://bscscan.com/address/${DEPLOYED_CONTRACT}#code`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-cyan-400 underline"
                        >
                          Dogrulanmis Kodu Gor <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    {verifyStatus === "error" && (
                      <div className="text-center p-4 rounded-md bg-red-500/10 border border-red-500/20 space-y-2">
                        <AlertTriangle className="w-6 h-6 text-red-400 mx-auto" />
                        <p className="text-sm text-red-400" data-testid="text-verify-error">{verifyMsg}</p>
                        <div className="flex flex-col gap-2">
                          <Button
                            onClick={() => { setVerifyStatus("idle"); setVerifyMsg(""); }}
                            variant="outline"
                            data-testid="button-verify-retry"
                          >
                            Tekrar Dene
                          </Button>
                          <a
                            href={`https://bscscan.com/verifyContract?a=${DEPLOYED_CONTRACT}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1 text-xs text-muted-foreground underline"
                          >
                            Manuel olarak BscScan'da dogrula <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="border-amber-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Image className="w-6 h-6 text-amber-400" />
                    BscScan Logo ve Token Bilgisi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-md bg-muted/20 border border-muted/30">
                    <img
                      src="/aidag-logo-256x256.png"
                      alt="AIDAG Logo"
                      className="w-16 h-16 rounded-md"
                      data-testid="img-aidag-logo"
                    />
                    <div>
                      <h4 className="font-bold text-amber-400">AIDAG Chain Logo</h4>
                      <p className="text-xs text-muted-foreground">256x256 PNG - BscScan icin hazir</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold">BscScan Token Bilgi Formu</h4>
                    <p className="text-xs text-muted-foreground">
                      Logo ve token bilgilerini BscScan'a eklemek icin asagidaki adimlar:
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-start gap-2 p-2 rounded-md bg-muted/10">
                        <span className="text-xs font-bold text-amber-400 mt-0.5">1</span>
                        <p className="text-xs text-muted-foreground">
                          <a href="https://bscscan.com/contactus" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">
                            BscScan Token Guncelleme
                          </a>{" "}
                          sayfasina gidin
                        </p>
                      </div>
                      <div className="flex items-start gap-2 p-2 rounded-md bg-muted/10">
                        <span className="text-xs font-bold text-amber-400 mt-0.5">2</span>
                        <p className="text-xs text-muted-foreground">
                          "Update Token Info" secenegini secin
                        </p>
                      </div>
                      <div className="flex items-start gap-2 p-2 rounded-md bg-muted/10">
                        <span className="text-xs font-bold text-amber-400 mt-0.5">3</span>
                        <p className="text-xs text-muted-foreground">
                          Kontrat adresi: <span className="font-mono text-emerald-400">{DEPLOYED_CONTRACT.slice(0, 10)}...{DEPLOYED_CONTRACT.slice(-8)}</span>
                        </p>
                      </div>
                      <div className="flex items-start gap-2 p-2 rounded-md bg-muted/10">
                        <span className="text-xs font-bold text-amber-400 mt-0.5">4</span>
                        <p className="text-xs text-muted-foreground">
                          256x256 PNG logoyu yukleyin (asagidan indirin)
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2 pt-2">
                      <a
                        href="/aidag-logo-256x256.png"
                        download="aidag-logo-256x256.png"
                        className="w-full"
                      >
                        <Button variant="outline" className="w-full" data-testid="button-download-logo">
                          <Image className="w-4 h-4 mr-2" />
                          Logo Indir (256x256 PNG)
                        </Button>
                      </a>
                      <a
                        href={`https://bscscan.com/address/${DEPLOYED_CONTRACT}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full"
                      >
                        <Button variant="outline" className="w-full" data-testid="button-view-bscscan">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          BscScan'da Kontrati Gor
                        </Button>
                      </a>
                    </div>
                  </div>

                  <div className="p-3 rounded-md bg-amber-500/10 border border-amber-500/20">
                    <p className="text-[11px] text-amber-400">
                      Token bilgileri genellikle 1-3 is gunu icinde BscScan tarafindan islenir. 
                      Onay sonrasinda AIDAG logosu kontrat sayfasinda gorunecektir.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}