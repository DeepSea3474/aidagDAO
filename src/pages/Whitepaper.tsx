import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText, ChevronRight, Brain, Shield, Layers, Zap,
  Vote, Globe, Lock, Cpu, GitBranch, Target, TrendingUp,
  Users, Eye, RefreshCw, Sparkles, ArrowRight, Download
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const SECTIONS = [
  {
    id: "abstract",
    title: "Abstract",
    icon: <FileText className="w-5 h-5" />,
    content: `AIDAG Chain introduces the world's first Directed Acyclic Graph (DAG) consensus-based cryptocurrency that combines quantum-resistant cryptography, autonomous AI governance via SoulwareAI, and multi-chain compatibility. Unlike traditional blockchain architectures, AIDAG utilizes a DAG structure where each transaction references multiple previous transactions, enabling parallel processing, near-instant finality (<0.001s), and unlimited scalability without sacrificing security.

The protocol is entirely autonomous — designed, developed, and continuously optimized by SoulwareAI, an advanced modular AI engine, without any founder intervention. All protocol upgrades, parameter adjustments, and security patches are proposed through DAO governance and implemented by SoulwareAI in real-time across BSC and Ethereum chains.

AIDAG also pioneers Quantum Security-as-a-Service (QSaaS), offering post-quantum cryptographic protection to other blockchains. This creates a sustainable revenue model where partner chains pay for quantum security, and this revenue is distributed to AIDAG token holders and stakers.`
  },
  {
    id: "dag-consensus",
    title: "DAG Consensus Mechanism",
    icon: <GitBranch className="w-5 h-5" />,
    content: `Traditional blockchains process transactions in sequential blocks, creating bottlenecks. AIDAG's DAG consensus fundamentally reimagines this:

**Directed Acyclic Graph Structure:**
- Each transaction is a vertex in the DAG, referencing 2-8 previous transactions
- No mining or block creation — transactions confirm each other
- Parallel transaction processing across unlimited threads
- Finality achieved in <0.001 seconds

**Advantages over Traditional Blockchain:**
- No block size limits — throughput scales linearly with network size
- No miner/validator centralization risk
- Zero confirmation waiting time for end users
- Energy efficiency: 99.99% less energy than Proof-of-Work

**DAG + AI Consensus:**
SoulwareAI dynamically adjusts DAG parameters (reference count, tip selection algorithm, confirmation threshold) based on real-time network conditions. This creates a self-optimizing consensus that becomes faster and more secure over time.

**Cross-Chain DAG Synchronization:**
AIDAG maintains synchronized DAG structures across BSC and Ethereum, enabling atomic cross-chain transactions without traditional bridge delays. SoulwareAI ensures consistency across all chains using quantum-secure state channels.`
  },
  {
    id: "quantum-security",
    title: "Quantum Security Architecture",
    icon: <Shield className="w-5 h-5" />,
    content: `AIDAG implements a 6-layer quantum-resistant security architecture using NIST-approved post-quantum cryptography standards:

**Layer 1 - CRYSTALS-Kyber (Key Encapsulation):**
All wallet key exchanges use lattice-based cryptography immune to Shor's algorithm. Key sizes: 768-1024 bits providing AES-256 equivalent security.

**Layer 2 - CRYSTALS-Dilithium (Digital Signatures):**
Every transaction signature uses post-quantum digital signatures. Signature size: 2,420 bytes with 128-bit quantum security level.

**Layer 3 - SPHINCS+ (Backup Signatures):**
Stateless hash-based signature scheme as secondary verification for critical operations (governance votes, large transfers).

**Layer 4 - Zero-Knowledge Proofs:**
zk-SNARKs validate transaction integrity without revealing sender, receiver, or amount. Full privacy with quantum-resistant proof generation.

**Layer 5 - Autonomous Key Rotation:**
SoulwareAI rotates all network encryption keys every 6 hours. Compromised keys become useless within the rotation window.

**Layer 6 - AI Threat Detection:**
Machine learning models trained on 500M+ known attack patterns provide real-time threat detection and automatic mitigation across all chains.

**Why This Matters:**
Google's quantum computer achieved 10^15 speedup over classical computers (2024). Within 5-10 years, RSA and ECDSA (used by Bitcoin, Ethereum, and 99% of blockchains) will be breakable. AIDAG is immune today.`
  },
  {
    id: "soulwareai",
    title: "SoulwareAI Autonomous Engine",
    icon: <Brain className="w-5 h-5" />,
    content: `SoulwareAI is the autonomous AI engine that designs, develops, and operates the entire AIDAG ecosystem without human intervention:

**Modular Architecture:**
- Protocol Engine: Core consensus and transaction processing
- Security Module: Threat detection and key rotation
- Bridge Engine: Cross-chain transfers and synchronization
- DAO Executor: Governance proposal implementation
- Optimizer: Performance tuning and fee optimization
- Analytics: Network metrics and predictive analysis
- Self-Evolution: AI model updates and capability expansion

**Autonomous Capabilities:**
1. Smart Contract Deployment: Writes, tests, and deploys contracts autonomously
2. Protocol Upgrades: Implements DAO-approved changes without downtime
3. Security Patching: Detects and patches vulnerabilities in real-time
4. Fee Optimization: Dynamically adjusts gas fees based on demand
5. Cross-Chain Sync: Maintains consistent state across all supported chains

**Self-Evolution:**
SoulwareAI continuously improves its own algorithms through reinforcement learning. It analyzes network performance, identifies optimization opportunities, and implements improvements — all autonomously, all approved by DAO.

**AI Predictive Analytics:**
Machine learning models analyze market conditions, network usage patterns, and security threats to predict and prevent issues before they occur. These analytics are also available to stakers as trading signals.`
  },
  {
    id: "dao-governance",
    title: "DAO Governance Model",
    icon: <Vote className="w-5 h-5" />,
    content: `AIDAG's governance is fully decentralized through a DAO where every protocol decision requires community approval:

**Governance Structure:**
- Proposal creation: Any member with 1,000+ AIDAG can submit proposals
- Voting period: 7 days per proposal
- Quorum requirement: 10% of total staked AIDAG
- Implementation: SoulwareAI autonomously executes approved proposals

**Voting Weight:**
Voting power is based on staking tier:
- Flexible: 1x voting weight
- Silver (30d): 1.5x voting weight
- Gold (90d): 3x voting weight
- Diamond (180d): 5x voting weight
- Quantum Vault (365d): 10x voting weight

**DAO Treasury:**
A percentage of all protocol revenue (QSaaS fees, bridge fees, swap fees) flows to the DAO treasury. The treasury is managed transparently on-chain with quarterly dividend distributions to holders.

**Governance Scope:**
- Protocol parameter changes (fees, limits, thresholds)
- New chain integrations
- QSaaS client approvals
- Treasury allocation decisions
- SoulwareAI upgrade approvals
- Partnership and integration decisions`
  },
  {
    id: "tokenomics",
    title: "Tokenomics & Value Model",
    icon: <TrendingUp className="w-5 h-5" />,
    content: `**Total Supply:** 17,999,000 AIDAG (fixed, no inflation)

**Distribution:**
- 55.6% Presale (10,000,000 AIDAG)
- 20.0% Liquidity Pool (3,600,000 AIDAG)
- 10.0% DAO Treasury (1,800,000 AIDAG)
- 10.0% Development (1,800,000 AIDAG)
- 4.4% Marketing (799,000 AIDAG)

**Revenue Streams for Holders:**
1. Staking APY: 5.2% - 35% based on lock duration
2. QSaaS Revenue Share: Up to 25% of quantum security service fees
3. DAO Treasury Dividends: Quarterly payouts from protocol revenue
4. Bridge Fee Share: 0.1% of all cross-chain transfer volumes
5. AI Prediction Pool: Performance-based returns from SoulwareAI analytics
6. Referral Rewards: 3% bonus on referred staking rewards

**Deflationary Mechanism:**
- 1% of all transaction fees are burned permanently
- Quarterly DAO-voted buy-back and burn events
- Target: Reduce circulating supply by 5% annually

**Value Proposition:**
AIDAG's value grows from three sources:
1. Scarcity (deflationary + fixed supply)
2. Utility (QSaaS, staking, governance, DeFi)
3. Revenue (real yield from service fees, not token emissions)

This makes AIDAG fundamentally different from inflationary DeFi tokens — value is backed by real revenue generation.`
  },
  {
    id: "multi-chain",
    title: "Multi-Chain Architecture",
    icon: <Layers className="w-5 h-5" />,
    content: `AIDAG operates natively on multiple chains simultaneously:

**Supported Chains:**
- BNB Smart Chain (BSC): Primary chain, lowest fees
- Ethereum: Maximum composability with DeFi ecosystem
- Future: Polygon, Arbitrum, Avalanche, Solana (planned)

**Cross-Chain Bridge:**
- Trustless atomic swaps between all supported chains
- Quantum-encrypted communication channels
- SoulwareAI-verified transfers with AI fraud detection
- Average bridge time: <2 minutes
- 99.98% success rate

**Parallel Chain Execution:**
Unlike traditional multi-chain tokens (wrapped/bridged), AIDAG maintains native presence on each chain with synchronized state through the DAG structure. This means:
- No wrapping/unwrapping needed
- No bridge trust assumptions
- Atomic cross-chain transactions
- Unified liquidity across all chains

**State Synchronization:**
SoulwareAI maintains a quantum-secure state channel between all chains, ensuring:
- Consistent token supply across chains
- Synchronized DAO votes
- Cross-chain staking positions
- Unified security monitoring`
  },
  {
    id: "roadmap",
    title: "Development Roadmap",
    icon: <Target className="w-5 h-5" />,
    content: `**Phase 1 - Genesis (Completed):**
- Smart contract deployment on BSC
- SoulwareAI modular engine integration
- Quantum-safe cryptography infrastructure
- Community building and initial DAO setup

**Phase 2 - AI Autonomous Development (Completed):**
- AI autonomous development engine activation
- Parallel chain execution infrastructure
- DAO voting mechanism going live
- First security audit and bug bounty

**Phase 3 - Ecosystem Expansion (In Progress):**
- DeFi protocol integrations (Swap, Lending, Vaults)
- Cross-chain bridge development (BSC ↔ ETH)
- Exchange listings (CEX + DEX)
- QSaaS launch for first partner chains

**Phase 4 - Full Autonomy & Scale:**
- Fully autonomous AI governance
- Multi-chain parallel execution at scale
- Enterprise partnerships
- 50+ QSaaS partner chains

**Phase 5 - Quantum Security Standard:**
- Industry-wide quantum security standard proposal
- Government and institutional adoption
- AIDAG becomes the default QSaaS provider
- 100+ partner chains

**Phase 6 - Global Financial Infrastructure:**
- Integration with traditional finance (TradFi)
- Central Bank Digital Currency (CBDC) quantum security
- Autonomous cross-chain DeFi ecosystem
- 1M+ active users, $1B+ TVL`
  },
];

export default function Whitepaper() {
  const [activeSection, setActiveSection] = useState("abstract");
  const active = SECTIONS.find(s => s.id === activeSection) || SECTIONS[0];

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/8 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/8 rounded-full blur-[150px]" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest mb-6">
                <FileText className="w-4 h-4" /> Technical Whitepaper
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 font-display" data-testid="text-whitepaper-title">
                AIDAG{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400">Whitepaper</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-400 px-2">
                Complete technical documentation of AIDAG Chain's DAG consensus, quantum security,
                autonomous AI governance, and multi-chain architecture.
              </p>
              <button className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl text-white font-bold text-sm hover:opacity-90 transition-opacity"
                data-testid="button-download-whitepaper">
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="lg:col-span-1">
              <div className="glass-card rounded-2xl p-4 border border-white/5 sticky top-24">
                <h4 className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3 px-2">Contents</h4>
                <nav className="space-y-1" data-testid="nav-whitepaper-toc">
                  {SECTIONS.map((s, i) => (
                    <button key={s.id} onClick={() => setActiveSection(s.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left text-sm transition-all ${
                        activeSection === s.id
                          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                          : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                      }`}
                      data-testid={`button-section-${s.id}`}>
                      <span className="flex-shrink-0">{s.icon}</span>
                      <span className="truncate">{s.title}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            <div className="lg:col-span-3">
              <motion.div key={activeSection} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-6 sm:p-8 lg:p-10 border border-white/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400">
                    {active.icon}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-display">{active.title}</h2>
                </div>
                <div className="prose prose-invert prose-sm max-w-none whitepaper-content" data-testid="text-whitepaper-content">
                  {active.content.split("\n\n").map((para, i) => {
                    if (para.startsWith("**") && para.endsWith("**")) {
                      return <h3 key={i} className="text-lg font-bold text-white mt-6 mb-3">{para.replace(/\*\*/g, "")}</h3>;
                    }
                    if (para.includes("**")) {
                      const parts = para.split(/(\*\*[^*]+\*\*)/);
                      return (
                        <p key={i} className="text-slate-300 leading-relaxed mb-4">
                          {parts.map((part, j) =>
                            part.startsWith("**") ? <strong key={j} className="text-white">{part.replace(/\*\*/g, "")}</strong> : part
                          )}
                        </p>
                      );
                    }
                    if (para.startsWith("- ")) {
                      return (
                        <ul key={i} className="space-y-2 mb-4 ml-4">
                          {para.split("\n").map((line, j) => (
                            <li key={j} className="text-slate-300 text-sm flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                              {line.replace(/^- /, "")}
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    return <p key={i} className="text-slate-300 leading-relaxed mb-4">{para}</p>;
                  })}
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between gap-4 flex-wrap">
                  {SECTIONS.findIndex(s => s.id === activeSection) > 0 && (
                    <button onClick={() => setActiveSection(SECTIONS[SECTIONS.findIndex(s => s.id === activeSection) - 1].id)}
                      className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                      data-testid="button-prev-section">
                      <ChevronRight className="w-4 h-4 rotate-180" /> Previous
                    </button>
                  )}
                  <div className="flex-1" />
                  {SECTIONS.findIndex(s => s.id === activeSection) < SECTIONS.length - 1 && (
                    <button onClick={() => setActiveSection(SECTIONS[SECTIONS.findIndex(s => s.id === activeSection) + 1].id)}
                      className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
                      data-testid="button-next-section">
                      Next Section <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
