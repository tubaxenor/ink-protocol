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

  describe("#escalateDisputeToMediator()", () => {
    this.shouldEscalateDisputetoMediator = (sender) => {
      // test escalate to mediator call in Disputed state
      it("escalates the transaction to mediator in Disputed state", async () => {
        let { transaction } = await $ink.createTransaction(buyer, seller, { token: token, state: $ink.states.Disputed })
        await token.escalateDisputeToMediator(transaction.id, { from: sender })
        transaction = await $ink.getTransaction(transaction.id, token)

        assert.equal(transaction.state, $ink.states.Escalated)
      })
    }

    this.shouldFail = (sender) => {
      it("this should fail", async () => {
        let { transaction } = await $ink.createTransaction(buyer, seller, { token: token, state: $ink.states.Disputed })

        await $ink.assertVMExceptionAsync("revert", token.escalateDisputeToMediator(transaction.id, { from: sender }))
      })
    }

    context("when called by buyer", () => {
      this.shouldFail(buyer)
    })

    context("when called by seller", () => {
      this.shouldEscalateDisputetoMediator(seller)
    })

    context("when called by authorized agent", () => {
      beforeEach(async () => {
        await token.authorize(agent, { from: seller })
      })
      this.shouldEscalateDisputetoMediator(agent)
    })

    context("when called by unauthorized agent", () => {
      this.shouldFail(agent)
    })

  })
}
