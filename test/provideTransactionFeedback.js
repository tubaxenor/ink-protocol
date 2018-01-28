const $util = require("./util")
const InkProtocol = artifacts.require("./mocks/InkProtocolMock.sol")

contract("InkProtocol", (accounts) => {
  let protocol

  beforeEach(async () => {
    protocol = await InkProtocol.new()
  })

  describe("#provideTransactionFeedback()", () => {
    it("fails for seller")
    it("fails for owner")
    it("fails for mediator")
    it("fails for policy")
    it("fails for unknown address")
    it("fails when transaction does not exist")
    it("fails when transaction state is Revoked")
    it("fails when transaction state is Accepted")
    it("fails when transaction state is Disputed")
    it("fails when transaction state is Escalated")
    it("fails when rating is invalid")
    it("emits the FeedbackUpdated event")
    it("allows multiple calls")
  })
})
