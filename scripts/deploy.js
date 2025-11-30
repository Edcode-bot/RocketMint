
const hre = require("hardhat");

async function main() {
  console.log("Deploying MiniRocketGame to Celo Alfajores...");

  const MiniRocketGame = await hre.ethers.getContractFactory("MiniRocketGame");
  const game = await MiniRocketGame.deploy();

  await game.waitForDeployment();

  const address = await game.getAddress();
  console.log(`MiniRocketGame deployed to: ${address}`);
  console.log(`Transaction hash: ${game.deploymentTransaction().hash}`);
  
  // Save deployment info
  const fs = require("fs");
  const deploymentInfo = {
    address,
    network: hre.network.name,
    deployer: (await hre.ethers.getSigners())[0].address,
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync(
    "./client/src/contracts/deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("Deployment info saved to client/src/contracts/deployment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
