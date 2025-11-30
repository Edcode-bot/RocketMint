
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MiniRocketGame", function () {
  let game;
  let owner;
  let player1;
  let player2;

  beforeEach(async function () {
    [owner, player1, player2] = await ethers.getSigners();
    const MiniRocketGame = await ethers.getContractFactory("MiniRocketGame");
    game = await MiniRocketGame.deploy();
    await game.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await game.owner()).to.equal(owner.address);
    });

    it("Should start at round 1", async function () {
      expect(await game.currentRound()).to.equal(1);
    });
  });

  describe("Predictions", function () {
    it("Should allow players to submit predictions", async function () {
      await expect(game.connect(player1).submitPrediction(3))
        .to.emit(game, "PredictionSubmitted")
        .withArgs(player1.address, 1, 3);

      const prediction = await game.getPrediction(1, player1.address);
      expect(prediction).to.equal(3);
    });

    it("Should reject invalid planet IDs", async function () {
      await expect(game.connect(player1).submitPrediction(0)).to.be.revertedWith(
        "Invalid planet ID"
      );
      await expect(game.connect(player1).submitPrediction(7)).to.be.revertedWith(
        "Invalid planet ID"
      );
    });

    it("Should prevent duplicate predictions in same round", async function () {
      await game.connect(player1).submitPrediction(2);
      await expect(game.connect(player1).submitPrediction(3)).to.be.revertedWith(
        "Already predicted this round"
      );
    });
  });

  describe("Round Resolution", function () {
    it("Should allow owner to resolve rounds", async function () {
      const seed = 12345;
      await expect(game.resolveRound(seed))
        .to.emit(game, "PlanetLanded");

      expect(await game.currentRound()).to.equal(2);
    });

    it("Should emit correct planet based on seed", async function () {
      const seed = 12345;
      const expectedPlanet = (seed % 6) + 1;
      
      await expect(game.resolveRound(seed))
        .to.emit(game, "PlanetLanded")
        .withArgs(1, expectedPlanet, seed);
    });

    it("Should only allow owner to resolve", async function () {
      await expect(game.connect(player1).resolveRound(123)).to.be.revertedWith(
        "Only owner can call this"
      );
    });
  });

  describe("XP System", function () {
    it("Should allow owner to award XP", async function () {
      await expect(game.awardXP(player1.address, 100))
        .to.emit(game, "XPAwarded")
        .withArgs(player1.address, 100);

      expect(await game.getPlayerXP(player1.address)).to.equal(100);
    });

    it("Should accumulate XP correctly", async function () {
      await game.awardXP(player1.address, 50);
      await game.awardXP(player1.address, 75);
      
      expect(await game.getPlayerXP(player1.address)).to.equal(125);
    });
  });
});
