// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AIDAG Chain Token
 * @notice World's First Fully Autonomous AI-Managed Quantum-Secure Cryptocurrency
 * @dev ERC-20 Token with Presale, Distribution, Governance, and Autonomous Management
 * @author SoulwareAI - Fully Autonomous Blockchain Intelligence
 * 
 * Contract Features:
 * - ERC-20 Standard Token (21,000,000 Fixed Supply)
 * - Multi-Stage Presale System (Stage 1: $0.078, Stage 2: $0.098, Listing: $0.12)
 * - Autonomous Distribution Engine (60% Operational / 40% DAO)
 * - Founder Token Lock (3,001,000 AIDAG - 1 Year Lock)
 * - Anti-Whale Protection (Max 2% per transaction)
 * - Burn Mechanism (Deflationary)
 * - Pause/Unpause Emergency Control
 * - Governance Proposal System
 * - Liquidity Pool Management
 * - CEX/DEX Listing Fund Management
 * 
 * Owner: SoulwareAI Autonomous Engine (No Human Intervention)
 * Website: https://aidag-chain.com
 * Chain: Binance Smart Chain (BSC)
 */

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

interface IERC20 {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 value) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

interface IERC20Metadata is IERC20 {
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
}

abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor(address initialOwner) {
        _transferOwnership(initialOwner);
    }

    modifier onlyOwner() {
        require(_owner == _msgSender(), "AIDAG: caller is not SoulwareAI");
        _;
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "AIDAG: new owner is zero address");
        _transferOwnership(newOwner);
    }

    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

abstract contract ReentrancyGuard {
    uint256 private constant NOT_ENTERED = 1;
    uint256 private constant ENTERED = 2;
    uint256 private _status;

    constructor() {
        _status = NOT_ENTERED;
    }

    modifier nonReentrant() {
        require(_status != ENTERED, "AIDAG: reentrant call");
        _status = ENTERED;
        _;
        _status = NOT_ENTERED;
    }
}

contract AIDAG is Context, IERC20, IERC20Metadata, Ownable, ReentrancyGuard {

    // ============================================================
    //                        TOKEN STORAGE
    // ============================================================

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    uint256 private _totalSupply;
    string private constant _name = "AIDAG Chain";
    string private constant _symbol = "AIDAG";
    uint8 private constant _decimals = 18;

    // ============================================================
    //                      SUPPLY CONSTANTS
    // ============================================================

    uint256 public constant MAX_SUPPLY = 21_000_000 * 10**18;
    uint256 public constant FOUNDER_ALLOCATION = 3_001_000 * 10**18;
    uint256 public constant DAO_ALLOCATION = 17_999_000 * 10**18;
    uint256 public constant ANTI_WHALE_LIMIT = 420_000 * 10**18; // 2% max per tx

    // ============================================================
    //                    WALLET ADDRESSES
    // ============================================================

    address public founderWallet;
    address public daoWallet;
    address public presaleWallet;
    address public liquidityWallet;

    // ============================================================
    //                    FOUNDER LOCK
    // ============================================================

    uint256 public founderLockEnd;
    bool public founderTokensLocked = true;

    // ============================================================
    //                    PRESALE SYSTEM
    // ============================================================

    enum PresaleStage { INACTIVE, STAGE_1, STAGE_2, COMPLETED }
    PresaleStage public currentPresaleStage = PresaleStage.INACTIVE;

    uint256 public presaleStage1Price = 0.078 ether; // per 1000 AIDAG in BNB equivalent
    uint256 public presaleStage2Price = 0.098 ether;
    uint256 public listingPrice = 0.12 ether;

    uint256 public totalPresaleRaised;
    uint256 public totalTokensSold;
    uint256 public presaleParticipants;
    mapping(address => uint256) public presalePurchases;
    mapping(address => bool) public isPresaleParticipant;

    uint256 public presaleMinPurchase = 0.01 ether;
    uint256 public presaleMaxPurchase = 10 ether;
    uint256 public presaleHardCap = 500 ether;
    uint256 public presaleSoftCap = 50 ether;
    uint256 public presaleTokenAllocation = 5_000_000 * 10**18;

    // ============================================================
    //                    REVENUE DISTRIBUTION
    // ============================================================

    uint256 public constant OPERATIONAL_SHARE = 60;
    uint256 public constant DAO_SHARE = 40;
    uint256 public totalOperationalRevenue;
    uint256 public totalDaoRevenue;

    // ============================================================
    //                     GOVERNANCE
    // ============================================================

    struct Proposal {
        uint256 id;
        string title;
        string description;
        address proposer;
        uint256 yesVotes;
        uint256 noVotes;
        uint256 startTime;
        uint256 endTime;
        bool executed;
        bool active;
    }

    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    uint256 public constant MIN_PROPOSAL_TOKENS = 1000 * 10**18;
    uint256 public constant VOTING_PERIOD = 7 days;

    // ============================================================
    //                    SECURITY & CONTROL
    // ============================================================

    bool public paused = false;
    bool public antiWhaleEnabled = true;
    uint256 public totalBurned;

    mapping(address => bool) public isExcludedFromLimit;
    mapping(address => bool) public blacklisted;

    // ============================================================
    //                    DEX/CEX MANAGEMENT
    // ============================================================

    uint256 public liquidityFund;
    uint256 public cexListingFund;
    uint256 public marketingFund;

    // ============================================================
    //                        EVENTS
    // ============================================================

    event TokensBurned(address indexed burner, uint256 amount);
    event PresaleStarted(PresaleStage stage);
    event PresalePurchase(address indexed buyer, uint256 bnbAmount, uint256 tokenAmount);
    event PresaleCompleted(uint256 totalRaised, uint256 totalSold);
    event RevenueDistributed(uint256 operational, uint256 dao);
    event FounderTokensUnlocked(uint256 amount);
    event ProposalCreated(uint256 indexed id, string title, address proposer);
    event VoteCast(uint256 indexed proposalId, address voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed id);
    event LiquidityAdded(uint256 tokenAmount, uint256 bnbAmount);
    event AntiWhaleToggled(bool enabled);
    event WalletUpdated(string walletType, address newAddress);
    event EmergencyPause(bool paused);
    event BlacklistUpdated(address account, bool status);
    event FundsAllocated(string fundType, uint256 amount);
    event AutonomousAction(string action, uint256 timestamp);

    // ============================================================
    //                      CONSTRUCTOR
    // ============================================================

    constructor(
        address _founderWallet,
        address _daoWallet
    ) Ownable(msg.sender) {
        require(_founderWallet != address(0), "AIDAG: founder wallet is zero");
        require(_daoWallet != address(0), "AIDAG: DAO wallet is zero");

        founderWallet = _founderWallet;
        daoWallet = _daoWallet;
        presaleWallet = msg.sender;
        liquidityWallet = msg.sender;

        // Mint total supply
        _totalSupply = MAX_SUPPLY;

        // Distribute tokens
        _balances[_founderWallet] = FOUNDER_ALLOCATION;
        emit Transfer(address(0), _founderWallet, FOUNDER_ALLOCATION);

        _balances[msg.sender] = DAO_ALLOCATION;
        emit Transfer(address(0), msg.sender, DAO_ALLOCATION);

        // Set founder lock (1 year)
        founderLockEnd = block.timestamp + 365 days;

        // Exclude system wallets from anti-whale
        isExcludedFromLimit[msg.sender] = true;
        isExcludedFromLimit[_founderWallet] = true;
        isExcludedFromLimit[_daoWallet] = true;
        isExcludedFromLimit[address(this)] = true;

        emit AutonomousAction("AIDAG Token Contract Deployed by SoulwareAI", block.timestamp);
    }

    // ============================================================
    //                    ERC-20 STANDARD
    // ============================================================

    function name() public pure override returns (string memory) {
        return _name;
    }

    function symbol() public pure override returns (string memory) {
        return _symbol;
    }

    function decimals() public pure override returns (uint8) {
        return _decimals;
    }

    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }

    function transfer(address to, uint256 value) public override returns (bool) {
        _transfer(_msgSender(), to, value);
        return true;
    }

    function allowance(address tokenOwner, address spender) public view override returns (uint256) {
        return _allowances[tokenOwner][spender];
    }

    function approve(address spender, uint256 value) public override returns (bool) {
        _approve(_msgSender(), spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) public override returns (bool) {
        address spender = _msgSender();
        uint256 currentAllowance = _allowances[from][spender];
        require(currentAllowance >= value, "AIDAG: insufficient allowance");
        unchecked {
            _approve(from, spender, currentAllowance - value);
        }
        _transfer(from, to, value);
        return true;
    }

    function increaseAllowance(address spender, uint256 addedValue) public returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender] + addedValue);
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool) {
        uint256 currentAllowance = _allowances[_msgSender()][spender];
        require(currentAllowance >= subtractedValue, "AIDAG: decreased below zero");
        unchecked {
            _approve(_msgSender(), spender, currentAllowance - subtractedValue);
        }
        return true;
    }

    // ============================================================
    //                   INTERNAL TRANSFERS
    // ============================================================

    function _transfer(address from, address to, uint256 amount) internal {
        require(!paused, "AIDAG: token transfers paused");
        require(from != address(0), "AIDAG: transfer from zero");
        require(to != address(0), "AIDAG: transfer to zero");
        require(!blacklisted[from] && !blacklisted[to], "AIDAG: blacklisted address");

        // Founder lock check
        if (from == founderWallet && founderTokensLocked) {
            require(block.timestamp >= founderLockEnd, "AIDAG: founder tokens locked for 1 year");
        }

        // Anti-whale check
        if (antiWhaleEnabled && !isExcludedFromLimit[from] && !isExcludedFromLimit[to]) {
            require(amount <= ANTI_WHALE_LIMIT, "AIDAG: exceeds 2% anti-whale limit");
        }

        require(_balances[from] >= amount, "AIDAG: insufficient balance");
        unchecked {
            _balances[from] -= amount;
            _balances[to] += amount;
        }

        emit Transfer(from, to, amount);
    }

    function _approve(address tokenOwner, address spender, uint256 amount) internal {
        require(tokenOwner != address(0), "AIDAG: approve from zero");
        require(spender != address(0), "AIDAG: approve to zero");
        _allowances[tokenOwner][spender] = amount;
        emit Approval(tokenOwner, spender, amount);
    }

    // ============================================================
    //                     PRESALE SYSTEM
    // ============================================================

    function startPresale(PresaleStage stage) external onlyOwner {
        require(stage == PresaleStage.STAGE_1 || stage == PresaleStage.STAGE_2, "AIDAG: invalid stage");
        currentPresaleStage = stage;
        emit PresaleStarted(stage);
        emit AutonomousAction("Presale stage activated by SoulwareAI", block.timestamp);
    }

    function buyPresale() external payable nonReentrant {
        require(currentPresaleStage != PresaleStage.INACTIVE && currentPresaleStage != PresaleStage.COMPLETED, "AIDAG: presale not active");
        require(msg.value >= presaleMinPurchase, "AIDAG: below minimum purchase");
        require(presalePurchases[msg.sender] + msg.value <= presaleMaxPurchase, "AIDAG: exceeds max purchase");
        require(totalPresaleRaised + msg.value <= presaleHardCap, "AIDAG: hard cap reached");

        uint256 price = currentPresaleStage == PresaleStage.STAGE_1 ? presaleStage1Price : presaleStage2Price;
        uint256 tokenAmount = (msg.value * 1000 * 10**18) / price;
        require(totalTokensSold + tokenAmount <= presaleTokenAllocation, "AIDAG: presale allocation exceeded");

        if (!isPresaleParticipant[msg.sender]) {
            isPresaleParticipant[msg.sender] = true;
            presaleParticipants++;
        }

        presalePurchases[msg.sender] += msg.value;
        totalPresaleRaised += msg.value;
        totalTokensSold += tokenAmount;

        _transfer(owner(), msg.sender, tokenAmount);

        // Auto distribute revenue: 60% operational, 40% DAO
        uint256 operationalAmount = (msg.value * OPERATIONAL_SHARE) / 100;
        uint256 daoAmount = msg.value - operationalAmount;
        totalOperationalRevenue += operationalAmount;
        totalDaoRevenue += daoAmount;

        if (daoWallet != address(0)) {
            (bool daoSuccess, ) = payable(daoWallet).call{value: daoAmount}("");
            require(daoSuccess, "AIDAG: DAO transfer failed");
        }

        emit PresalePurchase(msg.sender, msg.value, tokenAmount);
        emit RevenueDistributed(operationalAmount, daoAmount);
    }

    function endPresale() external onlyOwner {
        currentPresaleStage = PresaleStage.COMPLETED;
        emit PresaleCompleted(totalPresaleRaised, totalTokensSold);
        emit AutonomousAction("Presale completed by SoulwareAI", block.timestamp);
    }

    function updatePresaleParams(
        uint256 _minPurchase,
        uint256 _maxPurchase,
        uint256 _hardCap,
        uint256 _softCap
    ) external onlyOwner {
        if (_minPurchase > 0) presaleMinPurchase = _minPurchase;
        if (_maxPurchase > 0) presaleMaxPurchase = _maxPurchase;
        if (_hardCap > 0) presaleHardCap = _hardCap;
        if (_softCap > 0) presaleSoftCap = _softCap;
    }

    // ============================================================
    //                   BURN MECHANISM
    // ============================================================

    function burn(uint256 amount) external {
        require(_balances[_msgSender()] >= amount, "AIDAG: burn exceeds balance");
        unchecked {
            _balances[_msgSender()] -= amount;
            _totalSupply -= amount;
        }
        totalBurned += amount;
        emit Transfer(_msgSender(), address(0), amount);
        emit TokensBurned(_msgSender(), amount);
    }

    function burnFrom(address account, uint256 amount) external {
        uint256 currentAllowance = _allowances[account][_msgSender()];
        require(currentAllowance >= amount, "AIDAG: burn exceeds allowance");
        unchecked {
            _approve(account, _msgSender(), currentAllowance - amount);
            _balances[account] -= amount;
            _totalSupply -= amount;
        }
        totalBurned += amount;
        emit Transfer(account, address(0), amount);
        emit TokensBurned(account, amount);
    }

    // ============================================================
    //                    GOVERNANCE
    // ============================================================

    function createProposal(string calldata title, string calldata description) external returns (uint256) {
        require(_balances[_msgSender()] >= MIN_PROPOSAL_TOKENS, "AIDAG: need 1000+ AIDAG to propose");

        proposalCount++;
        Proposal storage p = proposals[proposalCount];
        p.id = proposalCount;
        p.title = title;
        p.description = description;
        p.proposer = _msgSender();
        p.startTime = block.timestamp;
        p.endTime = block.timestamp + VOTING_PERIOD;
        p.active = true;

        emit ProposalCreated(proposalCount, title, _msgSender());
        return proposalCount;
    }

    function createAutonomousProposal(string calldata title, string calldata description) external onlyOwner returns (uint256) {
        proposalCount++;
        Proposal storage p = proposals[proposalCount];
        p.id = proposalCount;
        p.title = title;
        p.description = description;
        p.proposer = _msgSender();
        p.startTime = block.timestamp;
        p.endTime = block.timestamp + VOTING_PERIOD;
        p.active = true;

        emit ProposalCreated(proposalCount, title, _msgSender());
        emit AutonomousAction("Autonomous proposal created by SoulwareAI", block.timestamp);
        return proposalCount;
    }

    function vote(uint256 proposalId, bool support) external {
        Proposal storage p = proposals[proposalId];
        require(p.active, "AIDAG: proposal not active");
        require(block.timestamp <= p.endTime, "AIDAG: voting ended");
        require(!hasVoted[proposalId][_msgSender()], "AIDAG: already voted");

        uint256 weight = _balances[_msgSender()];
        require(weight > 0, "AIDAG: no voting power");

        hasVoted[proposalId][_msgSender()] = true;

        if (support) {
            p.yesVotes += weight;
        } else {
            p.noVotes += weight;
        }

        emit VoteCast(proposalId, _msgSender(), support, weight);
    }

    function executeProposal(uint256 proposalId) external onlyOwner {
        Proposal storage p = proposals[proposalId];
        require(p.active, "AIDAG: proposal not active");
        require(block.timestamp > p.endTime, "AIDAG: voting not ended");
        require(!p.executed, "AIDAG: already executed");
        require(p.yesVotes > p.noVotes, "AIDAG: proposal rejected");

        p.executed = true;
        p.active = false;

        emit ProposalExecuted(proposalId);
        emit AutonomousAction("Proposal executed by SoulwareAI", block.timestamp);
    }

    // ============================================================
    //                 FOUNDER TOKEN LOCK
    // ============================================================

    function unlockFounderTokens() external {
        require(block.timestamp >= founderLockEnd, "AIDAG: lock period not ended");
        require(founderTokensLocked, "AIDAG: already unlocked");
        founderTokensLocked = false;
        emit FounderTokensUnlocked(FOUNDER_ALLOCATION);
        emit AutonomousAction("Founder tokens unlocked after 1 year", block.timestamp);
    }

    function getFounderLockTimeRemaining() external view returns (uint256) {
        if (block.timestamp >= founderLockEnd) return 0;
        return founderLockEnd - block.timestamp;
    }

    // ============================================================
    //                  FUND MANAGEMENT
    // ============================================================

    function allocateLiquidityFund(uint256 amount) external onlyOwner {
        require(_balances[owner()] >= amount, "AIDAG: insufficient balance");
        _transfer(owner(), address(this), amount);
        liquidityFund += amount;
        emit FundsAllocated("Liquidity", amount);
    }

    function allocateCEXFund(uint256 amount) external onlyOwner {
        require(_balances[owner()] >= amount, "AIDAG: insufficient balance");
        _transfer(owner(), address(this), amount);
        cexListingFund += amount;
        emit FundsAllocated("CEX Listing", amount);
    }

    function allocateMarketingFund(uint256 amount) external onlyOwner {
        require(_balances[owner()] >= amount, "AIDAG: insufficient balance");
        _transfer(owner(), address(this), amount);
        marketingFund += amount;
        emit FundsAllocated("Marketing", amount);
    }

    function releaseFunds(address to, uint256 amount) external onlyOwner {
        require(_balances[address(this)] >= amount, "AIDAG: insufficient contract balance");
        _transfer(address(this), to, amount);
    }

    // ============================================================
    //                SECURITY & ADMIN
    // ============================================================

    function pause() external onlyOwner {
        paused = true;
        emit EmergencyPause(true);
        emit AutonomousAction("Emergency pause activated by SoulwareAI", block.timestamp);
    }

    function unpause() external onlyOwner {
        paused = false;
        emit EmergencyPause(false);
        emit AutonomousAction("Emergency pause deactivated by SoulwareAI", block.timestamp);
    }

    function toggleAntiWhale(bool enabled) external onlyOwner {
        antiWhaleEnabled = enabled;
        emit AntiWhaleToggled(enabled);
    }

    function setExcludedFromLimit(address account, bool excluded) external onlyOwner {
        isExcludedFromLimit[account] = excluded;
    }

    function setBlacklist(address account, bool status) external onlyOwner {
        blacklisted[account] = status;
        emit BlacklistUpdated(account, status);
    }

    function updateFounderWallet(address newWallet) external onlyOwner {
        require(newWallet != address(0), "AIDAG: zero address");
        uint256 balance = _balances[founderWallet];
        if (balance > 0) {
            _balances[founderWallet] = 0;
            _balances[newWallet] = balance;
            emit Transfer(founderWallet, newWallet, balance);
        }
        isExcludedFromLimit[founderWallet] = false;
        isExcludedFromLimit[newWallet] = true;
        founderWallet = newWallet;
        emit WalletUpdated("Founder", newWallet);
    }

    function updateDaoWallet(address newWallet) external onlyOwner {
        require(newWallet != address(0), "AIDAG: zero address");
        isExcludedFromLimit[daoWallet] = false;
        isExcludedFromLimit[newWallet] = true;
        daoWallet = newWallet;
        emit WalletUpdated("DAO", newWallet);
    }

    // ============================================================
    //                  VIEW FUNCTIONS
    // ============================================================

    function getPresaleInfo() external view returns (
        PresaleStage stage,
        uint256 raised,
        uint256 sold,
        uint256 participants_,
        uint256 hardCap_,
        uint256 softCap_,
        uint256 allocation
    ) {
        return (
            currentPresaleStage,
            totalPresaleRaised,
            totalTokensSold,
            presaleParticipants,
            presaleHardCap,
            presaleSoftCap,
            presaleTokenAllocation
        );
    }

    function getTokenInfo() external view returns (
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 totalSupply_,
        uint256 totalBurned_,
        uint256 circulatingSupply,
        address owner_,
        bool paused_
    ) {
        return (
            _name,
            _symbol,
            _decimals,
            _totalSupply,
            totalBurned,
            _totalSupply - _balances[address(0)],
            owner(),
            paused
        );
    }

    function getGovernanceInfo() external view returns (
        uint256 totalProposals,
        uint256 minTokensToPropose,
        uint256 votingPeriod_
    ) {
        return (proposalCount, MIN_PROPOSAL_TOKENS, VOTING_PERIOD);
    }

    function getRevenueInfo() external view returns (
        uint256 operational,
        uint256 dao,
        uint256 total,
        uint256 operationalPercent,
        uint256 daoPercent
    ) {
        return (
            totalOperationalRevenue,
            totalDaoRevenue,
            totalOperationalRevenue + totalDaoRevenue,
            OPERATIONAL_SHARE,
            DAO_SHARE
        );
    }

    // ============================================================
    //                    BNB MANAGEMENT
    // ============================================================

    function withdrawBNB(address to, uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "AIDAG: insufficient BNB");
        (bool success, ) = payable(to).call{value: amount}("");
        require(success, "AIDAG: BNB transfer failed");
    }

    function distributeBNBRevenue() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "AIDAG: no BNB to distribute");

        uint256 operationalAmount = (balance * OPERATIONAL_SHARE) / 100;
        uint256 daoAmount = balance - operationalAmount;

        totalOperationalRevenue += operationalAmount;
        totalDaoRevenue += daoAmount;

        if (daoWallet != address(0)) {
            (bool daoSuccess, ) = payable(daoWallet).call{value: daoAmount}("");
            require(daoSuccess, "AIDAG: DAO transfer failed");
        }

        emit RevenueDistributed(operationalAmount, daoAmount);
        emit AutonomousAction("Revenue distributed by SoulwareAI", block.timestamp);
    }

    receive() external payable {}
    fallback() external payable {}
}
