
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MiniRocketGame {
    address public owner;
    uint256 public currentRound;
    
    mapping(address => uint256) public playerXP;
    mapping(uint256 => mapping(address => uint256)) public roundPredictions;
    
    event PredictionSubmitted(address indexed player, uint256 indexed round, uint256 planetId);
    event PlanetLanded(uint256 indexed round, uint256 planetId, uint256 seed);
    event XPAwarded(address indexed player, uint256 xpAmount);
    
    constructor() {
        owner = msg.sender;
        currentRound = 1;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    function submitPrediction(uint256 planetId) external {
        require(planetId >= 1 && planetId <= 6, "Invalid planet ID");
        require(roundPredictions[currentRound][msg.sender] == 0, "Already predicted this round");
        
        roundPredictions[currentRound][msg.sender] = planetId;
        
        emit PredictionSubmitted(msg.sender, currentRound, planetId);
    }
    
    function resolveRound(uint256 seed) external onlyOwner {
        uint256 landedPlanetId = (seed % 6) + 1;
        
        emit PlanetLanded(currentRound, landedPlanetId, seed);
        
        currentRound++;
    }
    
    function awardXP(address player, uint256 amount) external onlyOwner {
        playerXP[player] += amount;
        emit XPAwarded(player, amount);
    }
    
    function getPlayerXP(address player) external view returns (uint256) {
        return playerXP[player];
    }
    
    function getPrediction(uint256 round, address player) external view returns (uint256) {
        return roundPredictions[round][player];
    }
}
