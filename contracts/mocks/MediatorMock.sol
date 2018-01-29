pragma solidity ^0.4.11;

import '../InkMediator.sol';
import '../InkProtocol.sol';

contract MediatorMock is InkMediator {
  bool raiseError;

  // Response for mediation expiry.
  uint32 mediationExpiryResponse;

  // Response for mediator request.
  bool requestMediatorResponse;

  // Responses for fees.
  uint256 confirmTransactionFeeResponse;
  uint256 confirmTransactionAfterExpiryFeeResponse;
  uint256 confirmTransactionAfterDisputeFeeResponse;
  uint256 confirmTransactionByMediatorFeeResponse;
  uint256 refundTransactionFeeResponse;
  uint256 refundTransactionAfterExpiryFeeResponse;
  uint256 refundTransactionAfterDisputeFeeResponse;
  uint256 refundTransactionByMediatorFeeResponse;
  uint256 settleTransactionByMediatorFeeResponseForBuyer;
  uint256 settleTransactionByMediatorFeeResponseForSeller;

  // Events emitted when callbacks are called.
  event MediationExpiryCalled();
  event RequestMediatorCalled(
    uint256 transactionId,
    uint256 transactionAmount,
    address transactionOwner
  );
  event ConfirmTransactionFeeCalled(uint256 transactionAmount);
  event ConfirmTransactionAfterExpiryFeeCalled(uint256 transactionAmount);
  event ConfirmTransactionAfterDisputeFeeCalled(uint256 transactionAmount);
  event ConfirmTransactionByMediatorFeeCalled(uint256 transactionAmount);
  event RefundTransactionFeeCalled(uint256 transactionAmount);
  event RefundTransactionAfterExpiryFeeCalled(uint256 transactionAmount);
  event RefundTransactionAfterDisputeFeeCalled(uint256 transactionAmount);
  event RefundTransactionByMediatorFeeCalled(uint256 transactionAmount);
  event SettleTransactionByMediatorFeeCalled(uint256 buyerAmount, uint256 sellerAmount);

  modifier raisesError {
    if (raiseError) {
      assert(false);
    }
    _;
  }

  function setRaiseError(bool _raiseError) external {
    raiseError = _raiseError;
  }

  function setMediationExpiryResponse(uint32 _response) external {
    mediationExpiryResponse = _response;
  }

  function mediationExpiry() external raisesError returns(uint32) {
    MediationExpiryCalled();
    return mediationExpiryResponse;
  }

  function setRequestMediatorResponse(bool _response) external {
    requestMediatorResponse = _response;
  }

  function requestMediator(uint256 _transactionId, uint256 _transactionAmount, address _transactionOwner) external raisesError returns (bool) {
    RequestMediatorCalled({
      transactionId: _transactionId,
      transactionAmount: _transactionAmount,
      transactionOwner: _transactionOwner
    });
    return requestMediatorResponse;
  }

  function setConfirmTransactionFeeResponse(uint256 _response) external {
    confirmTransactionFeeResponse = _response;
  }

  function confirmTransactionFee(uint256 _transactionAmount) external raisesError returns (uint256) {
    _transactionAmount;
    ConfirmTransactionFeeCalled(_transactionAmount);
    return confirmTransactionFeeResponse;
  }

  function setConfirmTransactionAfterExpiryFeeResponse(uint256 _response) external {
    confirmTransactionAfterExpiryFeeResponse = _response;
  }

  function confirmTransactionAfterExpiryFee(uint256 _transactionAmount) external raisesError returns (uint256) {
    ConfirmTransactionAfterExpiryFeeCalled(_transactionAmount);
    return confirmTransactionAfterExpiryFeeResponse;
  }

  function confirmTransactionAfterDisputeFee(uint256 _transactionAmount) external raisesError returns (uint256) {
    _transactionAmount;
    ConfirmTransactionAfterDisputeFeeCalled(_transactionAmount);
    return confirmTransactionAfterDisputeFeeResponse;
  }

  function confirmTransactionByMediatorFee(uint256 _transactionAmount) external raisesError returns (uint256) {
    ConfirmTransactionByMediatorFeeCalled(_transactionAmount);
    return confirmTransactionByMediatorFeeResponse;
  }

  function refundTransactionFee(uint256 _transactionAmount) external raisesError returns (uint256) {
    RefundTransactionFeeCalled(_transactionAmount);
    return refundTransactionFeeResponse;
  }

  function refundTransactionAfterExpiryFee(uint256 _transactionAmount) external raisesError returns (uint256) {
    RefundTransactionAfterExpiryFeeCalled(_transactionAmount);
    return refundTransactionAfterExpiryFeeResponse;
  }

  function refundTransactionAfterDisputeFee(uint256 _transactionAmount) external raisesError returns (uint256) {
    RefundTransactionAfterDisputeFeeCalled(_transactionAmount);
    return refundTransactionAfterDisputeFeeResponse;
  }

  function refundTransactionByMediatorFee(uint256 _transactionAmount) external raisesError returns (uint256) {
    RefundTransactionByMediatorFeeCalled(_transactionAmount);
    return refundTransactionByMediatorFeeResponse;
  }

  function settleTransactionByMediatorFee(uint256 _buyerAmount, uint256 _sellerAmount) external raisesError returns (uint256, uint256) {
    SettleTransactionByMediatorFeeCalled({
      buyerAmount: _buyerAmount,
      sellerAmount: _sellerAmount
    });
    return (settleTransactionByMediatorFeeResponseForBuyer, settleTransactionByMediatorFeeResponseForSeller);
  }

  function refundTransaction(address _ink, uint256 _transactionId) external {
    InkProtocol(_ink).refundTransactionByMediator(_transactionId);
  }

  function confirmTransaction(address _ink, uint256 _transactionId) external {
    InkProtocol(_ink).confirmTransactionByMediator(_transactionId);
  }

  function settleTransaction(address _ink, uint256 _transactionId, uint256 _buyerAmount, uint256 _sellerAmount) external {
    InkProtocol(_ink).settleTransactionByMediator(_transactionId, _buyerAmount, _sellerAmount);
  }
}
