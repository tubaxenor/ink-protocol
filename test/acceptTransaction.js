const $util = require("./util")
const InkProtocol = artifacts.require("./mocks/InkProtocolMock.sol")

contract("InkProtocol", (accounts) => {
  let protocol

  beforeEach(async () => {
    protocol = await InkProtocol.new()
  })

  describe("#acceptTransaction()", () => {
    it("fails for buyer")
    it("fails for owner")
    it("fails for mediator")
    it("fails for policy")
    it("fails for unknown address")
    it("fails when transaction does not exist")
    it("fails when transaction is not Initiated state")

    describe("when a mediator is specified", () => {
      it("emits the TransactionAccepted event")
    })

    describe("when a mediator is not specified", () => {
      it("emits the TransactionAccepted event")
      it("emits the TransactionConfirmed event")
      it("transfers tokens from escrow to the seller")
    })
  })
})
