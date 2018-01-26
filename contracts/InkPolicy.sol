pragma solidity ^0.4.11;

contract InkPolicy {
  function transactionExpiry() external pure returns (uint32);
  function fulfillmentExpiry() external pure returns (uint32);
  function escalationExpiry() external pure returns (uint32);
}
