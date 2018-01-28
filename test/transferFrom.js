const $util = require("./util")
const InkProtocol = artifacts.require("./mocks/InkProtocolMock.sol")

contract("InkProtocol", (accounts) => {
  let protocol

  beforeEach(async () => {
    protocol = await InkProtocol.new()
  })

  describe("#transferFrom()", () => {
    it("fails when recipient is the protocol")
    it("succeeds when recipient is another address")
  })
})
