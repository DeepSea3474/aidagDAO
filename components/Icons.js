import {
  ShieldCheck,
  Network,
  Gavel,
  Scale,
  Coins,
  CreditCard,
  TrendingUp,
  BarChart3,
  BookOpenText,
  FileText,
  WalletMinimal,
  KeyRound,
  Cpu,
  BrainCircuit,
  Activity,
  History,
  Receipt,
  UsersRound,
  UserCheck,
  Globe,
  Languages,
  Settings2,
  SlidersHorizontal,
  Home,
} from "lucide-react";

const baseIconClasses =
  "w-5 h-5 text-slate-200 group-hover:text-indigo-300 transition-colors duration-150 icon-hover";

export const Icons = {
  Home: (props) => <Home className={baseIconClasses} {...props} />,
  DAO: (props) => <ShieldCheck className={baseIconClasses} {...props} />,
  DAONetwork: (props) => <Network className={baseIconClasses} {...props} />,
  Governance: (props) => <Gavel className={baseIconClasses} {...props} />,
  GovernanceScale: (props) => <Scale className={baseIconClasses} {...props} />,

  Presale: (props) => <Coins className={baseIconClasses} {...props} />,
  PresaleCard: (props) => <CreditCard className={baseIconClasses} {...props} />,
  PresaleTrend: (props) => <TrendingUp className={baseIconClasses} {...props} />,
  PresaleChart: (props) => <BarChart3 className={baseIconClasses} {...props} />,

  Docs: (props) => <BookOpenText className={baseIconClasses} {...props} />,
  DocsFile: (props) => <FileText className={baseIconClasses} {...props} />,

  Wallet: (props) => <WalletMinimal className={baseIconClasses} {...props} />,
  WalletKey: (props) => <KeyRound className={baseIconClasses} {...props} />,

  AI: (props) => <Cpu className={baseIconClasses} {...props} />,
  AIBrain: (props) => <BrainCircuit className={baseIconClasses} {...props} />,

  Activity: (props) => <Activity className={baseIconClasses} {...props} />,
  History: (props) => <History className={baseIconClasses} {...props} />,
  Receipt: (props) => <Receipt className={baseIconClasses} {...props} />,

  Members: (props) => <UsersRound className={baseIconClasses} {...props} />,
  MemberCheck: (props) => <UserCheck className={baseIconClasses} {...props} />,

  Globe: (props) => <Globe className={baseIconClasses} {...props} />,
  Languages: (props) => <Languages className={baseIconClasses} {...props} />,

  Settings: (props) => <Settings2 className={baseIconClasses} {...props} />,
  Sliders: (props) => <SlidersHorizontal className={baseIconClasses} {...props} />,
};
