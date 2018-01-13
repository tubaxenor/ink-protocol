const $ink = require("./utils")
const InkProtocolMock = artifacts.require("./mocks/InkProtocolMock.sol")

module.exports = (accounts) => {
  beforeEach(async () => {
    token = await InkProtocolMock.new()
    user = accounts[1]
    agent = accounts[2]
  })

  describe("#deauthorize()", () => {
    it("deauthorizes the agent", async () => {
      await token.authorize(agent, { from: user })
      await token.deauthorize(agent, { from: user })

      assert.isFalse(await token.authorizedBy(user, { from: agent }))
    })

    it("fails on bad agent address", async () => {
      await $ink.assertVMExceptionAsync("revert", token.deauthorize(0))
    })

    it("fails if agent is the sender", async () => {
      await $ink.assertVMExceptionAsync("revert", token.deauthorize(user, { from: user }))
    })
  })
}
