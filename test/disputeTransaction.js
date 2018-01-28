const $util = require("./util")
const InkProtocol = artifacts.require("./mocks/InkProtocolMock.sol")

contract("InkProtocol", (accounts) => {
  let protocol

  beforeEach(async () => {
    protocol = await InkProtocol.new()
  })

  describe("#disputeTransaction()", () => {
    it("fails for seller")
    it("fails for owner")
    it("fails for mediator")
    it("fails for policy")
    it("fails for unknown address")
    it("fails when transaction does not exist")
    it("fails before fulfillment expiry")
    it("calls the policy for the fulfillment expiry")
    it("sets fulfillment expiry to 0 when policy raises an error")
    it("emits the TransactionDisputed event")
  })
})
