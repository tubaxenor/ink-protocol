const $ink = require("./utils")
const InkProtocolMock = artifacts.require("./mocks/InkProtocolMock.sol")

module.exports = (accounts) => {
  let token
  let user = accounts[1]
  let agent = accounts[2]

  beforeEach(async () => {
    token = await InkProtocolMock.new()
  })

  describe("#authorizedBy()", () => {
    it("returns true when user is sender", async () => {
      assert.isTrue(await token.authorizedBy(user, { from: user }))
    })

    it("returns true when sender is authorized", async () => {
      await token.authorize(agent, { from: user })

      assert.isTrue(await token.authorizedBy(user, { from: agent }))
    })

    it("returns false when sender is not authorized", async () => {
      assert.isFalse(await token.authorizedBy(user, { from: agent }))
    })

    it("fails on bad user address", async () => {
      await $ink.assertVMExceptionAsync("revert", token.deauthorize(0))
    })
  })
}
