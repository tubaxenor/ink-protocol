pragma solidity ^0.4.11;

import '../InkProtocol.sol';

contract InkProtocolMock is InkProtocol {
  function InkProtocolMock() public {
    balances[msg.sender] = totalSupply_;
  }

  function _updateTransactionState(uint _id, TransactionState _state) external {
    transactions[_id].state = _state;
  }

  function _fetchTransaction(uint _id) external constant returns (address, address, address, address, TransactionState, uint) {
    var transaction = transactions[_id];

    return (transaction.owner,
            transaction.buyer,
            transaction.seller,
            transaction.mediator,
            transaction.state,
            transaction.amount);
  }
}
