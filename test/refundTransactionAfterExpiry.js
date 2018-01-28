const $util = require("./util")
const InkProtocol = artifacts.require("./mocks/InkProtocolMock.sol")

contract("InkProtocol", (accounts) => {
  let protocol

  beforeEach(async () => {
    protocol = await InkProtocol.new()
  })

  describe("#refundTransactionAfterExpiry()", () => {
    it("fails for seller")
    it("fails for owner")
    it("fails for mediator")
    it("fails for policy")
    it("fails for unknown address")
    it("fails when transaction does not exist")
    it("fails before escalation expiry")
    it("calls the policy for the escalation expiry")
    it("sets escalation expiry to 0 when policy raises an error")
    it("passes the transaction's amount to the mediator")
    it("transfers the mediator fee to the mediator")
    it("emits the TransactionRefundedAfterExpiry event")
    it("transfers the tokens to the buyer")
    it("collects 0 fee when mediator raises an error")
    it("collects 0 fee when mediator returns a fee higher than the transaction amount")
  })
})
