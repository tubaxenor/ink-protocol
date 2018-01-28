const $util = require("./util")
const InkProtocol = artifacts.require("./mocks/InkProtocolMock.sol")

contract("InkProtocol", (accounts) => {
  let protocol

  beforeEach(async () => {
    protocol = await InkProtocol.new()
  })

  describe("#confirmTransactionByMediator()", () => {
    it("fails for buyer")
    it("fails for seller")
    it("fails for owner")
    it("fails for policy")
    it("fails for unknown address")
    it("fails when transaction does not exist")
    it("fails when buyerAmount and sellerAmount does not add up to transaction amount")
    it("fails when mediator raises an error")
    it("fails when mediator returns a buyer's fee that is greater than buyer's amount")
    it("fails when mediator returns a seller's fee that is greater than seller's amount")
    it("passes the buyer's and seller's amount to the mediator")
    it("transfers the mediator fees to the mediator")
    it("transfers the tokens to the seller")
    it("transfers the tokens to the buyer")
    it("emits the TransactionSettledByMediator event")
  })
})
