const { ethers } = require("ethers");
const solc = require("solc");
const fs = require("fs");
const path = require("path");

const BSC_MAINNET_RPC = "https://bsc-dataseed.binance.org/";
const PRIVATE_KEY = process.env.SOULWARE_DAO_PRIVATE_KEY;
const FOUNDER_WALLET = process.env.NEXT_PUBLIC_FOUNDER_WALLET || "0xFf01Fa9D5d1e5FCc539eFB9654523A657F32ed23";
const SOULWARE_WALLET = process.env.SOULWARE_WALLET_ADDRESS || "0x65498beaA3e8506Ef2551a20b86A2a0cF0b85A7C";

async function main() {
  console.log("========================================");
  console.log("  AIDAG Chain - Autonomous Deployment");
  console.log("  Powered by SoulwareAI");
  console.log("========================================\n");

  if (!PRIVATE_KEY) {
    console.error("ERROR: SOULWARE_DAO_PRIVATE_KEY not set");
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(BSC_MAINNET_RPC);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  
  console.log("Deployer (SoulwareAI):", wallet.address);
  const balance = await provider.getBalance(wallet.address);
  console.log("BNB Balance:", ethers.formatEther(balance), "BNB");

  if (balance < ethers.parseEther("0.01")) {
    console.error("\nERROR: Insufficient BNB for deployment.");
    console.error("Send at least 0.03 BNB to:", wallet.address);
    process.exit(1);
  }

  console.log("\nCompiling AIDAG.sol...");
  const source = fs.readFileSync(path.join(__dirname, "AIDAG.sol"), "utf8");

  const input = {
    language: "Solidity",
    sources: {
      "AIDAG.sol": { content: source }
    },
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      outputSelection: {
        "*": {
          "*": ["*"]
        }
      }
    }
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  if (output.errors) {
    const errors = output.errors.filter(e => e.severity === "error");
    if (errors.length > 0) {
      console.error("Compilation errors:");
      errors.forEach(e => console.error(e.formattedMessage));
      process.exit(1);
    }
    output.errors.filter(e => e.severity === "warning").forEach(w => {
      console.log("Warning:", w.message);
    });
  }

  const contract = output.contracts["AIDAG.sol"]["AIDAG"];
  const bytecode = contract.evm.bytecode.object;
  const abi = contract.abi;

  console.log("Compilation successful!");
  console.log("Bytecode size:", (bytecode.length / 2), "bytes");

  fs.writeFileSync(
    path.join(__dirname, "AIDAG_ABI.json"),
    JSON.stringify(abi, null, 2)
  );

  fs.writeFileSync(
    path.join(__dirname, "AIDAG_compiled.json"),
    JSON.stringify({
      abi,
      bytecode: "0x" + bytecode,
      compilerVersion: "v0.8.34",
      optimizerEnabled: true,
      optimizerRuns: 200
    }, null, 2)
  );

  console.log("\nDeploying to BSC Mainnet...");
  console.log("Founder Wallet:", FOUNDER_WALLET);
  console.log("DAO Wallet (SoulwareAI):", SOULWARE_WALLET);

  const factory = new ethers.ContractFactory(abi, "0x" + bytecode, wallet);

  const gasPrice = await provider.getFeeData();
  console.log("Gas Price:", ethers.formatUnits(gasPrice.gasPrice, "gwei"), "Gwei");

  const deployTx = await factory.deploy(FOUNDER_WALLET, SOULWARE_WALLET, {
    gasPrice: gasPrice.gasPrice
  });

  console.log("\nTransaction sent:", deployTx.deploymentTransaction().hash);
  console.log("Waiting for confirmation...");

  await deployTx.waitForDeployment();
  const contractAddress = await deployTx.getAddress();

  console.log("\n========================================");
  console.log("  DEPLOYMENT SUCCESSFUL!");
  console.log("========================================");
  console.log("Contract Address:", contractAddress);
  console.log("Owner (SoulwareAI):", wallet.address);
  console.log("Founder Wallet:", FOUNDER_WALLET);
  console.log("DAO Wallet:", SOULWARE_WALLET);
  console.log("TX Hash:", deployTx.deploymentTransaction().hash);
  console.log("BscScan:", `https://bscscan.com/address/${contractAddress}`);
  console.log("========================================\n");

  fs.writeFileSync(
    path.join(__dirname, "deployment_info.json"),
    JSON.stringify({
      contractAddress,
      owner: wallet.address,
      founderWallet: FOUNDER_WALLET,
      daoWallet: SOULWARE_WALLET,
      network: "BSC Mainnet",
      chainId: 56,
      txHash: deployTx.deploymentTransaction().hash,
      deployedAt: new Date().toISOString(),
      bscscan: `https://bscscan.com/address/${contractAddress}`,
      compilerVersion: "v0.8.34",
      optimizerEnabled: true,
      optimizerRuns: 200
    }, null, 2)
  );

  console.log("Deployment info saved to contracts/deployment_info.json");
}

main().catch(error => {
  console.error("Deployment failed:", error.message);
  process.exit(1);
});
