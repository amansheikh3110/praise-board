const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying TipJar...");

  const TipJar = await ethers.getContractFactory("TipJar");
  const tipJar = await TipJar.deploy();

  await tipJar.waitForDeployment();

  const address = await tipJar.getAddress();
  console.log(`TipJar deployed to: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
