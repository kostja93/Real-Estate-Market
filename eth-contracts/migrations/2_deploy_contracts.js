// migrating the appropriate contracts
var SquareVerifier = artifacts.require("./SquareVerifier.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");

module.exports = function(deployer) {
  deployer.deploy(SquareVerifier);
  SquareVerifier.deployed().then( (verifier) => {
    deployer.deploy(SolnSquareVerifier, verifier.address);
  });
};
