const $ink = require("./utils")
const InkProtocolMock = artifacts.require("./mocks/InkProtocolMock.sol")
const commaNumber = require("comma-number")

module.exports = (accounts) => {
  let token
  let buyer = accounts[1]
  let seller = accounts[2]
  let amount = 100

  beforeEach(async () => {
    token = await InkProtocolMock.new()
  })

  describe("#revokeTransaction()", () => {
    this.shouldRevokeTheTransaction = (sender) => {
      it("revokes the transaction", async () => {
        let { transaction } = await $ink.createTransaction(buyer, seller, { token: token })
        await token.revokeTransaction(transaction.id, { from: sender })
        transaction = await $ink.getTransaction(transaction.id, token)

        assert.equal(transaction.state, $ink.states.Revoked)
      })

      it("sends tokens back to the buyer", async () => {
        let originalContractBalance = await $ink.getBalance(token.address, token)
        let { transaction } = await $ink.createTransaction(buyer, seller, { token: token, amount: amount })
        await token.revokeTransaction(transaction.id, { from: sender })

        assert.equal(await $ink.getBalance(buyer, token), amount)
        assert.equal(await $ink.getBalance(token.address, token), originalContractBalance)
      })

      if (process.env.FULL == "1") {
        $ink.forEachStateExcept($ink.states.Initiated, (stateName, state) => {
          it(`fails when called from the ${stateName} state`, async () => {
            let { transaction } = await $ink.createTransaction(buyer, seller, { token: token })
            await token._updateTransactionState(transaction.id, state)

            await $ink.assertVMExceptionAsync("revert", token.revokeTransaction(transaction.id, { from: sender }))
          })
        })
      }
    }

    this.shouldFail = (sender) => {
      it("fails", async () => {
        let { transaction } = await $ink.createTransaction(buyer, seller, { token: token })

        await $ink.assertVMExceptionAsync("revert", token.revokeTransaction(transaction.id, { from: sender }))
      })
    }

    context("when called by buyer", () => {
      this.shouldRevokeTheTransaction(buyer)
    })

    context("when called by seller", () => {
      this.shouldFail(seller)
    })

    context("when called by authorized agent", () => {
      beforeEach(async () => {
        await token.authorize(agent, { from: buyer })
      })

      this.shouldRevokeTheTransaction(agent)
    })

    context("when called by unauthorized agent", () => {
      this.shouldFail(agent)
    })
  })
}
