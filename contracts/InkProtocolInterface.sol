pragma solidity ^0.4.11;

interface InkProtocolInterface {
  function authorize(address _agent) external;
  function authorizedBy(address _account) public view returns (bool);
  function link(address _to) external;
  function createTransaction(address _buyer, address _seller, uint256 _amount, bytes32 _metadata, address _policy, address _mediator) external;
  function revokeTransaction(uint256 _id) external;
  function acceptTransaction(uint256 _id) external;
  function confirmTransaction(uint256 _id) external;
  function confirmTransactionAfterExpiry(uint256 _id) external;
  function refundTransaction(uint256 _id) external;
  function refundTransactionAfterExpiry(uint256 _id) external;
  function disputeTransaction(uint256 _id) external;
  function escalateDisputeToMediator(uint256 _id) external;
  function settleTransaction(uint256 _id) external;
  function refundTransactionByMediator(uint256 _id) external;
  function confirmTransactionByMediator(uint256 _id) external;
  function settleTransactionByMediator(uint256 _id, uint256 _buyerAmount, uint256 _sellerAmount) external;
  function provideTransactionFeedback(uint256 _id, uint8 _rating, bytes32 _comment) external;
  function helloNgan() external;
}
