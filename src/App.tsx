import { useEffect, useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WalletProvider } from "@/lib/walletContext";
import SoulwareAssistant from "@/components/SoulwareAssistant";
import WalletModal from "@/components/WalletModal";
import { useWallet } from "@/lib/walletContext";
import Home from "@/pages/Home";
import Presale from "@/pages/Presale";
import DAO from "@/pages/DAO";
import Dashboard from "@/pages/Dashboard";
import Staking from "@/pages/Staking";
import Bridge from "@/pages/Bridge";
import Explorer from "@/pages/Explorer";
import Ecosystem from "@/pages/Ecosystem";
import Security from "@/pages/Security";
import Whitepaper from "@/pages/Whitepaper";
import BrandKit from "@/pages/BrandKit";
import ExchangeListing from "@/pages/ExchangeListing";
import DeployContract from "@/pages/DeployContract";
import NotFound from "@/pages/not-found";
import "./lib/i18n";

function ScrollProgress() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setWidth(scrollPercent);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return <div className="scroll-progress" style={{ width: `${width}%` }} />;
}

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/presale" component={Presale} />
      <Route path="/dao" component={DAO} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/staking" component={Staking} />
      <Route path="/bridge" component={Bridge} />
      <Route path="/explorer" component={Explorer} />
      <Route path="/ecosystem" component={Ecosystem} />
      <Route path="/security" component={Security} />
      <Route path="/whitepaper" component={Whitepaper} />
      <Route path="/brand-kit" component={BrandKit} />
      <Route path="/exchange-listing" component={ExchangeListing} />
      <Route path="/deploy" component={DeployContract} />
      <Route component={NotFound} />
    </Switch>
  );
}

function GlobalWalletModal() {
  const wallet = useWallet();
  return (
    <WalletModal
      isOpen={wallet.showWalletModal}
      onClose={() => wallet.setShowWalletModal(false)}
      onConnect={wallet.connect}
      isConnecting={wallet.isConnecting}
      connectingWallet={wallet.connectingWallet}
      error={wallet.error}
    />
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WalletProvider>
          <ScrollProgress />
          <ScrollToTop />
          <Toaster />
          <Router />
          <GlobalWalletModal />
          <SoulwareAssistant />
        </WalletProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
