const $util = require("./util")
const InkProtocol = artifacts.require("./mocks/InkProtocolMock.sol")

contract("InkProtocol", (accounts) => {
  let protocol

  beforeEach(async () => {
    protocol = await InkProtocol.new()
  })

  describe("#InkProtocol()", () => {
    it("specifies a total supply of 500M tokens", async () => {
      let totalSupply = await protocol.totalSupply()
      assert.equal(totalSupply.toNumber(), 500000000e18)
    })

    it("specifies the token name", async () => {
      let name = await protocol.name()
      assert.equal(name, "Ink Protocol")
    })

    it("specifies the token symbol", async () => {
      let symbol = await protocol.symbol()
      assert.equal(symbol, "XNK")
    })

    it("specifies the token decimals", async () => {
      let decimals = await protocol.decimals()
      assert.equal(decimals, 18)
    })
  })
})
