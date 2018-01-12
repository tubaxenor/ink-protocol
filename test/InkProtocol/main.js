const $ink = require("./utils")
const InkProtocol = artifacts.require("./mocks/InkProtocol.sol")

module.exports = (accounts) => {
  beforeEach(async () => {
    ink = await InkProtocol.new()
  })

  describe("#InkProtocol()", () => {
  })
}
