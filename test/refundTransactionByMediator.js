const $util = require("./util")
const InkProtocol = artifacts.require("./mocks/InkProtocolMock.sol")

contract("InkProtocol", (accounts) => {
  let protocol

  beforeEach(async () => {
    protocol = await InkProtocol.new()
  })

  describe("#refundTransactionByMediator()", () => {
    it("fails for buyer")
    it("fails for seller")
    it("fails for owner")
    it("fails for policy")
    it("fails for unknown address")
    it("fails when transaction does not exist")
    it("fails when mediator raises an error")
    it("fails when mediator returns a fee greater than transaction amount")
    it("passes the transaction's amount to the mediator")
    it("transfers the mediator fee to the mediator")
    it("transfers the tokens to the buyer")
    it("emits the TransactionRefundedByMediator event")
  })
})
