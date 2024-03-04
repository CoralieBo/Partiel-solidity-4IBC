const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Pronostics", function () {
  let pronosticsContract;
  let owner, user;

  describe("Deployment", function () {

    it("Init accounts", async function () {
      [owner, user] = await ethers.getSigners();
    });

    it("Should set the right bet price", async function () {
      const pronostics = await ethers.getContractFactory("Pronostics");
      const betPrice = ethers.parseEther("0.01");
      pronosticsContract = await pronostics.deploy(betPrice);
      await pronosticsContract.waitForDeployment();

      expect(await pronosticsContract.betPrice()).to.equal(betPrice);
    });

    it("Should set the right owner", async function () {
      [owner] = await ethers.getSigners();
      expect(await pronosticsContract.owner()).to.equal(owner.address);
    });
  });

  describe("Bets", function () {
    it("create a match", async function () {
      const timestamp = Math.floor(Date.now() / 1000) + 30; // now + 30 seconds
      await pronosticsContract.addMatch(timestamp, "France", "Germany");
    });

    it("bet on a match without inscriptions", async function () {
      const betAmount = ethers.parseEther("0.01");
      await expect(pronosticsContract.connect(user).bet(0, 1, 2, { value: betAmount }))
        .to.be.revertedWithoutReason;
    });

    it("user inscription", async function () {
      await pronosticsContract.connect(user).inscription("user");
    });

    it("bet on a match with wrong bet", async function () {
      await expect(pronosticsContract.connect(user).bet(0, 1, 2, { value: 0 }))
        .to.be.revertedWith('You must pay the bet price');
    });

    it("bet on a match", async function () {
      const betAmount = ethers.parseEther("0.01");
      await pronosticsContract.connect(user).bet(0, 1, 2, { value: betAmount });
    });

    it("bet second time on a match", async function () {
      const betAmount = ethers.parseEther("0.01");
      await expect(pronosticsContract.connect(user).bet(0, 1, 2, { value: betAmount }))
        .to.be.revertedWith('You already bet on this match');
    });

    // Advance time to match start
    it("advance time", async function () {
      await ethers.provider.send("evm_increaseTime", [31]);
      await ethers.provider.send("evm_mine");
    });

    it("bet on match already started", async function () {
      const betAmount = ethers.parseEther("0.01");
      await expect(pronosticsContract.connect(user).bet(0, 1, 2, { value: betAmount }))
        .to.be.revertedWith('Match already started');
    });

    it("end match", async function () {
      await pronosticsContract.closeMatch(0, 1, 2);
    });

    it("refund", async function () {
      const refundAmount = (await pronosticsContract.getUser(user.address))[2];
      expect(refundAmount).to.equal(ethers.parseEther("0.01"));
      await pronosticsContract.connect(user).withdrawRefund();
      const refundAmountAfter = (await pronosticsContract.getUser(user.address))[2];
      expect(refundAmountAfter).to.equal(ethers.parseEther("0"));
    });

    it("bet on a match finished", async function () {
      const betAmount = ethers.parseEther("0.01");
      await expect(pronosticsContract.connect(user).bet(0, 1, 2, { value: betAmount }))
        .to.be.revertedWith('Match already finished');
    });
  });

});