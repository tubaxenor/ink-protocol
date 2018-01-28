const $util = require("./util")
const InkProtocol = artifacts.require("./mocks/InkProtocolMock.sol")

contract("InkProtocol", (accounts) => {
  let protocol

  beforeEach(async () => {
    protocol = await InkProtocol.new()
  })

  describe("#createTransaction()", () => {
    it("fails when seller address is invalid")
    it("fails when seller and buyer are the same")
    it("fails when owner and buyer are the same")
    it("fails when owner and seller are the same")
    it("fails when amount is 0")
    it("fails when mediator is not specified but policy is")
    it("fails when the owner rejects the transaction")
    it("increments the global transaction ID for the next transaction")
    it("emits the TransactionInitiated event")
    it("transfers buyer's tokens to escrow")

    describe("when mediator is specified", () => {
      it("fails when policy is not specified")
      it("fails when mediator rejects the transaction")
      it("passes the transaction's id, amount, and owner the mediator")
      it("emits the TransactionInitiated event with mediator and policy")
    })

    describe("when owner is specified", () => {
      it("passes the transaction's id and buyer to the owner")
      it("emits the TransactionInitiated event with owner")
    })
  })
})
