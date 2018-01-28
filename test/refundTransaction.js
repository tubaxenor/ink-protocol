const $util = require("./util")
const InkProtocol = artifacts.require("./mocks/InkProtocolMock.sol")

contract("InkProtocol", (accounts) => {
  let protocol

  beforeEach(async () => {
    protocol = await InkProtocol.new()
  })

  describe("#refundTransaction()", () => {
    it("fails for buyer")
    it("fails for owner")
    it("fails for mediator")
    it("fails for policy")
    it("fails for unknown address")
    it("fails when transaction does not exist")

    describe("when state is Accepted", () => {
      it("passes the transaction's amount to the mediator")
      it("transfers the mediator fee to the mediator")
      it("emits the TransactionRefunded event")
      it("transfers the tokens to the buyer")
      it("collects 0 fee when mediator raises an error")
      it("collects 0 fee when mediator returns a fee higher than the transaction amount")
    })

    describe("when state is Disputed", () => {
      it("passes the transaction's amount to the mediator")
      it("transfers the mediator fee to the mediator")
      it("emits the TransactionRefundedAfterDispute event")
      it("transfers the tokens to the buyer")
      it("collects 0 fee when mediator raises an error")
      it("collects 0 fee when mediator returns a fee higher than the transaction amount")
    })

    describe("when state is Escalated", () => {
      it("fails before mediation expiry")
      it("calls the mediator for the mediation expiry")
      it("sets mediation expiry to 0 when mediator raises an error")
      it("passes the transaction's amount to the mediator")
      it("transfers the mediator fee to the mediator")
      it("emits the TransactionRefundedAfterEscalation event")
      it("transfers the tokens to the buyer")
      it("collects 0 fee when mediator raises an error")
      it("collects 0 fee when mediator returns a fee higher than the transaction amount")
    })
  })
})
