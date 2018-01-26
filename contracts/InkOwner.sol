pragma solidity ^0.4.11;

interface InkOwner {
  function authorizeTransaction(uint256 _id, address _buyer, address _seller, address _policy, address _mediator) external returns (bool);
}
