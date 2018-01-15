const $ink = require("./utils")
const InkProtocolMock = artifacts.require("./mocks/InkProtocolMock.sol")
const PolicyMock = artifacts.require("./mocks/PolicyMock.sol")
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

  describe("#disputeTransaction()", () => {
    this.shouldDisputeTheTransaction = (sender) => {
      // test dispute call in Accepted state
      it("disputes the transaction in Accepted state", async () => {
        let { transaction, policy } = await $ink.createTransaction(buyer, seller, { token: token, state: $ink.states.Accepted })
        let fulfillmentExpiry = await policy.fulfillmentExpiry()
        $ink.advanceTime(fulfillmentExpiry.toNumber())
        await token.disputeTransaction(transaction.id, { from: sender })
        transaction = await $ink.getTransaction(transaction.id, token)

        assert.equal(transaction.state, $ink.states.Disputed)
      })

      if (process.env.FULL == "1") {
        $ink.forEachStateExcept($ink.states.Accepted, (stateName, state) => {
          it(`fails when called from the ${stateName} state`, async () => {
            let { transaction, policy } = await $ink.createTransaction(buyer, seller, { token: token })
            await token._updateTransactionState(transaction.id, state)
            let fulfillmentExpiry = await policy.fulfillmentExpiry()
            $ink.advanceTime(fulfillmentExpiry.toNumber())

            await $ink.assertVMExceptionAsync("revert", token.disputeTransaction(transaction.id, { from: sender }))
          })
        })
      }
    }

    this.shouldFail = (sender, advanceTime) => {
      it("fails", async () => {
        let { transaction, policy } = await $ink.createTransaction(buyer, seller, { token: token, state: $ink.states.Accepted })
        let fulfillmentExpiry = await policy.fulfillmentExpiry()
        if (advanceTime) { $ink.advanceTime(fulfillmentExpiry.toNumber()) }

        await $ink.assertVMExceptionAsync("revert", token.disputeTransaction(transaction.id, { from: sender }))
      })
    }

    context("when dispute started by buyer", () => {
      context("before fulfillment expiry", () => {
        this.shouldFail(buyer, false)
      })

      context("after fulfillment expiry", () => {
        this.shouldDisputeTheTransaction(buyer)
      })
    })

    context ("when dispute started by seller", () => {
      context("before fulfillment expiry", () => {
        this.shouldFail(seller, false)
      })

      context("after fulfillment expiry", () => {
        this.shouldFail(seller, true)
      })
    })

    context("when dispute started by authorized agent", () => {
      beforeEach(async () => {
        await token.authorize(agent, { from: buyer })
      })

      context("before fulfillment expiry", () => {
        this.shouldFail(agent, false)
      })

      context("after fulfillment expiry", () => {
        this.shouldDisputeTheTransaction(agent)
      })
    })

    context("when dispute started by unauthorized agent", () => {
      context("before fulfillment expiry", () => {
        this.shouldFail(agent, false)
      })

      context("after fulfillment expiry", () => {
        this.shouldFail(agent, false)
      })
    })
  })
}
