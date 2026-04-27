// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * AIDAG Presale Contract — BSC (BEP-20)
 * Payments:  BNB  +  USDT (0x55d398326f99059fF775485246999027B3197955, 18 decimals on BSC)
 * Token:     AIDAG 0xe6B06f7C63F6AC84729007ae8910010F6E721041 (18 decimals)
 *
 * Revenue split (automatic on every buy — kontrat BNB/USDT tutmaz):
 *   60% → Founder Wallet  0xFf01Fa9D5d1e5FCc539eFB9654523A657F32ed23
 *   40% → DAO/Soulware    0xC16eC985D98Db96DE104Bf1e39E1F2Fdb9a712E9
 *
 * Pricing model:
 *   - usdtPriceE4  : AIDAG fiyati USDT * 10000 cinsinden (Stage 1 = 780 -> $0.0780)
 *   - bnbRate      : 1 BNB = kac AIDAG (ornek 7692, $600 BNB / $0.078 AIDAG)
 *   Deploy sonrasi owner her ikisini de setRate ile gunceller.
 *
 * Flow:
 *   DAO cuzdan bu kontrata AIDAG transfer eder (ornek 9M). Her alimda kontrat
 *   buyer'a AIDAG'i transfer eder, odemeyi 60/40 ile Founder+DAO cuzdanina iletir.
 */

interface IERC20 {
    function transfer(address to, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract AIDAGPresale {
    // ── Immutable addresses ───────────────────────────────────────────
    IERC20 public constant AIDAG = IERC20(0xe6B06f7C63F6AC84729007ae8910010F6E721041);
    IERC20 public constant USDT  = IERC20(0x55d398326f99059fF775485246999027B3197955);

    address payable public founderWallet = payable(0xFf01Fa9D5d1e5FCc539eFB9654523A657F32ed23);
    address payable public daoWallet     = payable(0xC16eC985D98Db96DE104Bf1e39E1F2Fdb9a712E9);

    uint16 public constant FOUNDER_BPS = 6000; // 60%
    uint16 public constant DAO_BPS     = 4000; // 40%
    uint16 public constant BPS_DENOM   = 10000;

    // ── Owner & state ─────────────────────────────────────────────────
    address public owner;
    uint256 public bnbRate;            // 1 BNB -> bnbRate AIDAG (whole tokens)
    uint256 public usdtPriceE4;        // AIDAG price in USDT * 1e4 (780 = $0.0780)
    uint256 public minBuyBnbWei;
    uint256 public minBuyUsdtWei;      // USDT on BSC has 18 decimals
    uint256 public hardCapTokens;      // AIDAG (with 18 decimals)
    uint256 public soldTokens;
    uint8   public stage;              // 1 or 2 active; 0 = stopped
    bool    public paused;

    mapping(address => uint256) public boughtAidag;
    mapping(address => uint256) public paidBnb;
    mapping(address => uint256) public paidUsdt;

    // ── Events ────────────────────────────────────────────────────────
    event BoughtBNB (address indexed buyer, uint256 bnbWei,  uint256 aidagAmount, uint8 stage);
    event BoughtUSDT(address indexed buyer, uint256 usdtWei, uint256 aidagAmount, uint8 stage);
    event SplitBNB (uint256 founderShare, uint256 daoShare);
    event SplitUSDT(uint256 founderShare, uint256 daoShare);
    event StageChanged(uint8 stage, uint256 bnbRate, uint256 usdtPriceE4, uint256 hardCap);
    event PauseChanged(bool paused);
    event WalletsChanged(address founder, address dao);
    event TokensRecovered(address indexed token, address indexed to, uint256 amount);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() { require(msg.sender == owner, "Not owner"); _; }

    // ── Constructor ───────────────────────────────────────────────────
    constructor(uint256 _bnbRate, uint256 _usdtPriceE4, uint256 _hardCapTokens) {
        require(_bnbRate > 0 && _usdtPriceE4 > 0 && _hardCapTokens > 0, "Zero");
        owner         = msg.sender;
        bnbRate       = _bnbRate;
        usdtPriceE4   = _usdtPriceE4;
        hardCapTokens = _hardCapTokens;
        minBuyBnbWei  = 0.01 ether;
        minBuyUsdtWei = 10 * 1e18; // 10 USDT
        stage         = 1;
        emit OwnershipTransferred(address(0), msg.sender);
        emit StageChanged(1, _bnbRate, _usdtPriceE4, _hardCapTokens);
    }

    // ── BNB purchase ──────────────────────────────────────────────────
    receive() external payable { _buyBNB(msg.sender, msg.value); }
    function buy() external payable { _buyBNB(msg.sender, msg.value); }

    function _buyBNB(address buyer, uint256 bnbWei) internal {
        require(!paused && (stage == 1 || stage == 2), "Inactive");
        require(bnbWei >= minBuyBnbWei, "Below min");

        uint256 aidagAmount = bnbWei * bnbRate;
        require(aidagAmount > 0, "Zero amount");

        uint256 remaining = hardCapTokens > soldTokens ? hardCapTokens - soldTokens : 0;
        require(remaining > 0, "Sold out");

        uint256 refund = 0;
        if (aidagAmount > remaining) {
            uint256 usableBnb = remaining / bnbRate;
            refund = bnbWei - usableBnb;
            bnbWei = usableBnb;
            aidagAmount = remaining;
        }

        soldTokens          += aidagAmount;
        boughtAidag[buyer]  += aidagAmount;
        paidBnb[buyer]      += bnbWei;

        require(AIDAG.transfer(buyer, aidagAmount), "AIDAG xfer");

        uint256 founderShare = (bnbWei * FOUNDER_BPS) / BPS_DENOM;
        uint256 daoShare     = bnbWei - founderShare;
        (bool okF, ) = founderWallet.call{value: founderShare}("");
        require(okF, "Founder BNB fail");
        (bool okD, ) = daoWallet.call{value: daoShare}("");
        require(okD, "DAO BNB fail");
        emit SplitBNB(founderShare, daoShare);

        if (refund > 0) {
            (bool okR, ) = payable(buyer).call{value: refund}("");
            require(okR, "Refund fail");
        }

        emit BoughtBNB(buyer, bnbWei, aidagAmount, stage);
    }

    // ── USDT purchase ─────────────────────────────────────────────────
    // Buyer MUST approve USDT to this contract first.
    function buyWithUSDT(uint256 usdtAmount) external {
        require(!paused && (stage == 1 || stage == 2), "Inactive");
        require(usdtAmount >= minBuyUsdtWei, "Below min");

        // aidagAmount = usdtAmount * 10000 / usdtPriceE4   (both 18-decimals on BSC)
        uint256 aidagAmount = (usdtAmount * 10000) / usdtPriceE4;
        require(aidagAmount > 0, "Zero amount");

        uint256 remaining = hardCapTokens > soldTokens ? hardCapTokens - soldTokens : 0;
        require(remaining > 0, "Sold out");

        uint256 usableUsdt = usdtAmount;
        if (aidagAmount > remaining) {
            // scale usdtAmount down to exactly match the remaining tokens
            usableUsdt = (remaining * usdtPriceE4) / 10000;
            aidagAmount = remaining;
        }

        soldTokens          += aidagAmount;
        boughtAidag[msg.sender] += aidagAmount;
        paidUsdt[msg.sender]    += usableUsdt;

        // Pull USDT from buyer, then split 60/40 directly to wallets
        uint256 founderShare = (usableUsdt * FOUNDER_BPS) / BPS_DENOM;
        uint256 daoShare     = usableUsdt - founderShare;
        require(USDT.transferFrom(msg.sender, founderWallet, founderShare), "USDT->Founder fail");
        require(USDT.transferFrom(msg.sender, daoWallet,     daoShare),     "USDT->DAO fail");
        emit SplitUSDT(founderShare, daoShare);

        require(AIDAG.transfer(msg.sender, aidagAmount), "AIDAG xfer");

        emit BoughtUSDT(msg.sender, usableUsdt, aidagAmount, stage);
    }

    // ── Owner controls ────────────────────────────────────────────────
    function setStage(uint8 newStage, uint256 newBnbRate, uint256 newUsdtPriceE4, uint256 newHardCap) external onlyOwner {
        require(newStage <= 2, "Bad stage");
        if (newStage != 0) { require(newBnbRate > 0 && newUsdtPriceE4 > 0, "Zero rate"); }
        stage         = newStage;
        bnbRate       = newBnbRate;
        usdtPriceE4   = newUsdtPriceE4;
        hardCapTokens = newHardCap;
        emit StageChanged(newStage, newBnbRate, newUsdtPriceE4, newHardCap);
    }

    function setRate(uint256 newBnbRate, uint256 newUsdtPriceE4) external onlyOwner {
        require(newBnbRate > 0 && newUsdtPriceE4 > 0, "Zero");
        bnbRate     = newBnbRate;
        usdtPriceE4 = newUsdtPriceE4;
        emit StageChanged(stage, newBnbRate, newUsdtPriceE4, hardCapTokens);
    }

    function setLimits(uint256 _minBnbWei, uint256 _minUsdtWei) external onlyOwner {
        minBuyBnbWei  = _minBnbWei;
        minBuyUsdtWei = _minUsdtWei;
    }

    function setPaused(bool p) external onlyOwner {
        paused = p;
        emit PauseChanged(p);
    }

    function setWallets(address payable newFounder, address payable newDao) external onlyOwner {
        require(newFounder != address(0) && newDao != address(0), "Zero");
        founderWallet = newFounder;
        daoWallet     = newDao;
        emit WalletsChanged(newFounder, newDao);
    }

    function recoverTokens(address tokenAddr, address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Zero to");
        require(IERC20(tokenAddr).transfer(to, amount), "Recover fail");
        emit TokensRecovered(tokenAddr, to, amount);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero owner");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    // ── Views ─────────────────────────────────────────────────────────
    function tokensRemaining() external view returns (uint256) {
        return hardCapTokens > soldTokens ? hardCapTokens - soldTokens : 0;
    }

    function quoteBNB(uint256 bnbWei) external view returns (uint256 aidagAmount) {
        return bnbWei * bnbRate;
    }

    function quoteUSDT(uint256 usdtAmount) external view returns (uint256 aidagAmount) {
        return (usdtAmount * 10000) / usdtPriceE4;
    }
}
