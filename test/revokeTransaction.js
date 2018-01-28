const $util = require("./util")
const InkProtocol = artifacts.require("./mocks/InkProtocolMock.sol")

contract("InkProtocol", (accounts) => {
  let protocol

  beforeEach(async () => {
    protocol = await InkProtocol.new()
  })

  describe("#revokeTransaction()", () => {
    it("fails for seller")
    it("fails for owner")
    it("fails for mediator")
    it("fails for policy")
    it("fails for unknown address")
    it("fails when transaction does not exist")
    it("fails when transaction is not Initiated state")
    it("emits the TransactionRevoked event")
    it("transfers tokens from escrow back to the buyer (and only buyer)")
    it("fails when approveTransaction is called afterwards")
  })
})
