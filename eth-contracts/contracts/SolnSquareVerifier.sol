pragma solidity >=0.4.21 <0.6.0;

import "./ERC721Mintable.sol";
// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract Verifier {
  function verifyTx(uint[2] memory, uint[2][2] memory, uint[2] memory, uint[2] memory) public returns(bool);
}

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is ERC721MintableComplete {
  // TODO define a solutions struct that can hold an index & an address
  struct Solution {
    bytes32 index;
    address callee;
  }

  // TODO define an array of the above struct
  Solution[] private solutions;

  // TODO define a mapping to store unique solutions submitted
  mapping(bytes32 => address) private uniqueSolutions;

  // TODO Create an event to emit when a solution is added
  event SolutionAdded(bytes32 index, address callee);

  Verifier private verifierContract;

  constructor(address verifiertContractAddress) public {
    verifierContract = Verifier(verifiertContractAddress);
  }

  // TODO Create a function to add the solutions to the array and emit the event
  function addSolution(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory inputs) public {
    require(verifierContract.verifyTx(a, b, c, inputs) == true, "Invalid solution");
    bytes32 index = sha256(abi.encodePacked(a, b, c, inputs));
    require(uniqueSolutions[index] == address(0), "Solution already taken");
    address callee = msg.sender;
    uniqueSolutions[index] = callee;
    solutions.push(Solution({ index: index, callee: callee}));
    emit SolutionAdded(index, callee);
  }

  // TODO Create a function to mint new NFT only after the solution has been verified
  function mint(address to) public onlyOwner returns(bool) {
    require(totalSupply() <= solutions.length, "Not enought solutions provided");
    super.mint(to);
  }
}
