const hre = require("hardhat");

async function main() {

  const betPrice = hre.ethers.parseEther("0.01");
  const pronostics = await hre.ethers.deployContract("Pronostics", [betPrice]);

  await pronostics.waitForDeployment();

  console.log(
    `Pronostics with ${betPrice} ETH bet price deployed to: ${await pronostics.getAddress()}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
