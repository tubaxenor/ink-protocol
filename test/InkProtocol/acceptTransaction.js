const $ink = require("./utils")
const InkProtocolMock = artifacts.require("./mocks/InkProtocolMock.sol")
const commaNumber = require("comma-number")

module.exports = (accounts) => {
  let token
  let buyer = accounts[1]
  let seller = accounts[2]
  let agent = accounts[3]
  let amount = 100

  beforeEach(async () => {
    token = await InkProtocolMock.new()
  })

  describe("#acceptTransaction()", () => {
    this.shouldAcceptTheTransaction = (sender) => {
      it("accepts the transaction", async () => {
        let { transaction, mediator } = await $ink.createTransaction(buyer, seller, { token: token })
        await token.acceptTransaction(transaction.id, { from: sender })
        transaction = await $ink.getTransaction(transaction.id, token)

        assert.equal(transaction.state, $ink.states.Accepted)
        assert.equal(transaction.amount, amount)
      })

      if (process.env.FULL == "1") {
        $ink.forEachStateExcept($ink.states.Initiated, (stateName, state) => {
          it(`fails when called from the ${stateName} state`, async () => {
            let { transaction } = await $ink.createTransaction(buyer, seller, { token: token })
            await token._updateTransactionState(transaction.id, state)

            await $ink.assertVMExceptionAsync("revert", token.acceptTransaction(transaction.id, { from: sender }))
          })
        })
      }
    }

    this.shouldFail = (sender) => {
      it("fails", async () => {
        let { transaction, token } = await $ink.createTransaction(buyer, seller)

        await $ink.assertVMExceptionAsync("revert", token.acceptTransaction(transaction.id, { from: sender }))
      })
    }

    context("when called by buyer", () => {
      this.shouldFail(buyer)
    })

    context("when called by seller", () => {
      this.shouldAcceptTheTransaction(seller)
    })

    context("when called by authorized agent", () => {
      beforeEach(async () => {
        await token.authorize(agent, { from: seller })
      })

      this.shouldAcceptTheTransaction(agent)
    })

    context("when called by unauthorized agent", () => {
      this.shouldFail(agent)
    })
  })
}
