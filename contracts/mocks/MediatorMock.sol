pragma solidity ^0.4.11;

import '../InkMediator.sol';
import '../InkProtocol.sol';

contract MediatorMock is InkMediator {
  function mediationExpiry() external returns(uint32) {
    return 10 days;
  }

  function requestMediator(uint256 _transactionId, uint256 _transactionAmount, address _transactionOwner) external returns (bool) {
    _transactionId;
    _transactionOwner;
    _transactionAmount;
    return true;
  }

  function refundTransaction(uint256 _transactionId, address _ink) external {
    InkProtocol(_ink).refundTransactionByMediator(_transactionId);
  }

  function confirmTransaction(uint256 _transactionId, address _ink) external {
    InkProtocol(_ink).confirmTransactionByMediator(_transactionId);
  }

  function settleTransaction(uint256 _transactionId, uint256 _buyerAmount, uint256 _sellerAmount, address _ink) external {
    InkProtocol(_ink).settleTransactionByMediator(_transactionId, _buyerAmount, _sellerAmount);
  }

  function confirmTransactionFee(uint256 _transactionAmount) external returns (uint256) {
    _transactionAmount;
    return 10;
  }

  function confirmTransactionAfterExpiryFee(uint256 _transactionAmount) external returns (uint256) {
    _transactionAmount;
    return 11;
  }

  function confirmTransactionAfterDisputeFee(uint256 _transactionAmount) external returns (uint256) {
    _transactionAmount;
    return 12;
  }

  function confirmTransactionByMediatorFee(uint256 _transactionAmount) external returns (uint256) {
    _transactionAmount;
    return 13;
  }

  function refundTransactionFee(uint256 _transactionAmount) external returns (uint256) {
    _transactionAmount;
    return 14;
  }

  function refundTransactionAfterExpiryFee(uint256 _transactionAmount) external returns (uint256) {
    _transactionAmount;
    return 15;
  }

  function refundTransactionAfterDisputeFee(uint256 _transactionAmount) external returns (uint256) {
    _transactionAmount;
    return 16;
  }

  function refundTransactionByMediatorFee(uint256 _transactionAmount) external returns (uint256) {
    _transactionAmount;
    return 17;
  }

  function settleTransactionByMediatorFee(uint256 _buyerAmount, uint256 _sellerAmount) external returns (uint256, uint256) {
    return (_buyerAmount / 10, _sellerAmount / 10);
  }

  function _selfdestruct(address _recipient) external {
    selfdestruct(_recipient);
  }
}
