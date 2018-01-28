const $util = require("./util")
const InkProtocol = artifacts.require("./mocks/InkProtocolMock.sol")

contract("InkProtocol", (accounts) => {
  let protocol

  beforeEach(async () => {
    protocol = await InkProtocol.new()
  })

  describe("#escalateDisputeToMediator()", () => {
    it("fails for buyer")
    it("fails for owner")
    it("fails for mediator")
    it("fails for policy")
    it("fails for unknown address")
    it("fails when transaction does not exist")
    it("emits the TransactionEscalated event")
  })
})
