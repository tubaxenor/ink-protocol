const $util = require("./util")
const InkProtocol = artifacts.require("./mocks/InkProtocolMock.sol")

contract("InkProtocol", (accounts) => {
  let protocol

  beforeEach(async () => {
    protocol = await InkProtocol.new()
  })

  describe("#confirmTransaction()", () => {
    it("fails for seller")
    it("fails for owner")
    it("fails for mediator")
    it("fails for policy")
    it("fails for unknown address")
    it("fails when transaction does not exist")

    describe("when state is Accepted", () => {
      it("passes the transaction's amount to the mediator")
      it("transfers the mediator fee to the mediator")
      it("emits the TransactionConfirmed event")
      it("transfers the tokens to the seller")
      it("collects 0 fee when mediator raises an error")
      it("collects 0 fee when mediator returns a fee higher than the transaction amount")
    })

    describe("when state is Disputed", () => {
      it("passes the transaction's amount to the mediator")
      it("transfers the mediator fee to the mediator")
      it("emits the TransactionConfirmedAfterDispute vent")
      it("transfers the tokens to the seller")
      it("collects 0 fee when mediator raises an error")
      it("collects 0 fee when mediator returns a fee higher than the transaction amount")
    })

    describe("when state is Escalated", () => {
      it("fails before mediation expiry")
      it("calls the mediator for the mediation expiry")
      it("sets mediation expiry to 0 when mediator raises an error")
      it("passes the transaction's amount to the mediator")
      it("transfers the mediator fee to the mediator")
      it("emits the TransactionConfirmedAfterEscalation event")
      it("transfers the tokens to the seller")
      it("collects 0 fee when mediator raises an error")
      it("collects 0 fee when mediator returns a fee higher than the transaction amount")
    })
  })
})
