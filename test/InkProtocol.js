'use strict';

let files = [
  "./InkProtocol/gasAnalysis",
  "./InkProtocol/authorize",
  "./InkProtocol/authorizedBy",
  "./InkProtocol/createTransaction",
  "./InkProtocol/revokeTransaction",
  "./InkProtocol/acceptTransaction",
  "./InkProtocol/confirmTransaction",
  "./InkProtocol/confirmTransactionAfterExpiry",
  "./InkProtocol/refundTransaction",
  "./InkProtocol/refundTransactionAfterExpiry",
  "./InkProtocol/disputeTransaction",
  "./InkProtocol/escalateDisputeToMediator",
  "./InkProtocol/settleTransaction",
  "./InkProtocol/refundTransactionByMediator",
  "./InkProtocol/confirmTransactionByMediator",
  "./InkProtocol/settleTransactionByMediator",
  "./InkProtocol/provideTransactionFeedback"
  "./InkProtocol/transfer"
]

for (let fileIndex in files) {
  contract("InkProtocol", async (accounts) => {
    require(files[fileIndex]).call(this, accounts)
  })
}
