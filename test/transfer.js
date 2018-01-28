const $util = require("./util")
const InkProtocol = artifacts.require("./mocks/InkProtocolMock.sol")

contract("InkProtocol", (accounts) => {
  let protocol

  beforeEach(async () => {
    protocol = await InkProtocol.new()
  })

  describe("#transfer()", () => {
    it("fails when sending Ether to the protocol")
    it("succeeds when sending Ether to another address")
  })
})
