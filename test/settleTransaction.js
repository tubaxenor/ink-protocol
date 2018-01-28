const $util = require("./util")
const InkProtocol = artifacts.require("./mocks/InkProtocolMock.sol")

contract("InkProtocol", (accounts) => {
  let protocol

  beforeEach(async () => {
    protocol = await InkProtocol.new()
  })

  describe("#settleTransaction()", () => {
    it("fails for owner")
    it("fails for mediator")
    it("fails for policy")
    it("fails for unknown address")

    describe("when called by buyer", () => {
      it("fails before mediation expiry")
      it("calls the mediator for the mediation expiry")
      it("sets mediation expiry to 0 when mediator raises an error")
      it("splits the transaction amount for buyer and seller")
      it("gives the seller more when amount is not divisible by 2")
      it("emits the TransactionSettled event")
    })

    describe("when called by seller", () => {
      it("fails before mediation expiry")
      it("calls the mediator for the mediation expiry")
      it("sets mediation expiry to 0 when mediator raises an error")
      it("splits the transaction amount for buyer and seller")
      it("gives the seller more when amount is not divisible by 2")
      it("emits the TransactionSettled event")
    })
  })
})
