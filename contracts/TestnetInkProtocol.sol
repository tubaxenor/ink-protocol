pragma solidity ^0.4.11;

import './InkProtocol.sol';

contract TestnetInkProtocol is InkProtocol {
  string public constant name = "Ink Protocol (Testnet)";
  string public constant symbol = "TESTXNK";

  // Distribute 1,000 TESTXNK tokens at a time.
  uint public constant distributionAmount = 1000000000000000000000;

  mapping(address => uint) public xnkDistributions;

  function requestTestXNK() public returns (bool) {
    require(xnkDistributions[msg.sender] < now - 1 minutes);
    xnkDistributions[msg.sender] = now;

    balances[msg.sender] = balances[msg.sender].add(distributionAmount);

    Transfer(this, msg.sender, distributionAmount);
  }
}
