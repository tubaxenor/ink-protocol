const $ink = require("./utils")
const InkProtocolMock = artifacts.require("./mocks/InkProtocolMock.sol")

module.exports = (accounts) => {
  let ink;
  let sender = accounts[0];
  let user = accounts[1];
  let amount = 10;

  beforeEach(async () => {
    ink = await InkProtocolMock.new()
  })

  describe("#transfer()", () => {
    it("transfers token", async () => {
      await ink.transfer(user, amount)

      assert.equal(await $ink.getBalance(user, ink), amount)
    })

    it("fails if receiver is the contract", async () => {
      await $ink.assertVMExceptionAsync("revert", ink.transfer(ink.address, amount))
    })
  })

  describe("#transferFrom()", () => {
    it("transfers ink", async () => {
      senderBalance = await $ink.getBalance(sender, ink)

      await ink.approve(sender, amount)

      await ink.transferFrom(sender, user, amount)

      assert.equal(await $ink.getBalance(sender, ink), senderBalance - amount)

      assert.equal(await $ink.getBalance(user, ink), amount)
    })

    it("fails if receiver is the contract", async () => {
      await $ink.assertVMExceptionAsync("revert", ink.transferFrom(sender, ink.address, 10))
    })
  })
}
