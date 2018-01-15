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

  describe("#refundTransaction()", () => {
    this.shouldRefundTheTransaction = (sender) => {
      // test refund transaction in Accepted state
      it("refunds the transaction in Accepted state", async () => {
        let originalContractBalance = await $ink.getBalance(token.address, token)
        let { transaction, mediator } = await $ink.createTransaction(buyer, seller, { token: token, state: $ink.states.Accepted })
        await token.refundTransaction(transaction.id, { from: sender })
        transaction = await $ink.getTransaction(transaction.id, token)

        assert.equal(transaction.state, $ink.states.Refunded)
        assert.equal(await $ink.getBalance(token.address, token), originalContractBalance)

        let refundTransactionFee = await mediator.refundTransactionFee.call(transaction.amount)

        assert.equal(await $ink.getBalance(buyer, token), amount - refundTransactionFee)
      })

      // test refund transaction in Disputed state
      it("refunds the transaction in Disputed state", async () => {
        let originalContractBalance = await $ink.getBalance(token.address, token)
        let { transaction, mediator } = await $ink.createTransaction(buyer, seller, { token: token, state: $ink.states.Disputed })
        await token.refundTransaction(transaction.id, { from: sender })
        transaction = await $ink.getTransaction(transaction.id, token)

        assert.equal(transaction.state, $ink.states.RefundedAfterDispute)
        assert.equal(await $ink.getBalance(token.address, token), originalContractBalance)

        let refundTransactionAfterDisputeFee = await mediator.refundTransactionAfterDisputeFee.call(transaction.amount)

        assert.equal(await $ink.getBalance(buyer, token), amount - refundTransactionAfterDisputeFee)
      })

      // test refund transaction in Escalated state
      it("refunds the transaction in Escalated state", async () => {
        let originalContractBalance = await $ink.getBalance(token.address, token)
        let { transaction, mediator } = await $ink.createTransaction(buyer, seller, { token: token, state: $ink.states.Escalated })
        let [ _, mediationExpiry ] = await mediator.requestMediator.call(transaction.id, transaction.amount)
        $ink.advanceTime(mediationExpiry.toNumber())
        await token.refundTransaction(transaction.id, { from: sender })
        transaction = await $ink.getTransaction(transaction.id, token)

        assert.equal(transaction.state, $ink.states.RefundedAfterEscalation)
        assert.equal(await $ink.getBalance(buyer, token), amount)
        assert.equal(await $ink.getBalance(token.address, token), originalContractBalance)
      })
    }

    this.shouldFail = (sender) => {
      it("fails in Accepted state", async () => {
        let { transaction } = await $ink.createTransaction(buyer, seller, { token: token, state: $ink.states.Accepted })

        await $ink.assertVMExceptionAsync("revert", token.refundTransaction(transaction.id, { from: sender }))
      })

      it("fails in Disputed state", async () => {
        let { transaction } = await $ink.createTransaction(buyer, seller, { token: token, state: $ink.states.Disputed })

        await $ink.assertVMExceptionAsync("revert", token.refundTransaction(transaction.id, { from: sender }))
      })
    }

    this.shouldFailBeforeExpiry = (sender, advanceTime) => {
      it("fails in Escalated state", async () => {
        let { transaction, mediator } = await $ink.createTransaction(buyer, seller, { token: token, state: $ink.states.Escalated })
        let [ _, mediationExpiry ] = await mediator.requestMediator.call(transaction.id, transaction.amount)
        if (advanceTime) { $ink.advanceTime(mediationExpiry.toNumber()) }

        await $ink.assertVMExceptionAsync("revert", token.refundTransaction(transaction.id, { from: sender }))
      })
    }

    context("when confirm transaction by buyer", () => {
      context("before escalation expiry", () => {
        this.shouldFail(buyer)
        this.shouldFailBeforeExpiry(buyer, false)
      })

      context("after escalation expiry", () => {
        this.shouldFail(buyer)
        this.shouldFailBeforeExpiry(buyer, true)
      })
    })

    context("when confirm transaction by seller", () => {
      context("before escalation expiry", () => {
        this.shouldFailBeforeExpiry(seller, false)
      })

      context("after escalation expiry", () => {
        this.shouldRefundTheTransaction(seller)
      })
    })

    context("when confirm transaction by authorized agent", () => {
      beforeEach(async () => {
        await token.authorize(agent, { from: seller })
      })

      context("before escalation expiry", () => {
        this.shouldFailBeforeExpiry(agent, false)
      })

      context("after escalation expiry", () => {
        this.shouldRefundTheTransaction(agent)
      })
    })

    context("when confirm transaction by unauthorized agent", () => {
      context("before escalation expiry", () => {
        this.shouldFail(agent)
        this.shouldFailBeforeExpiry(agent, false)
      })

      context("after escalation expiry", () => {
        this.shouldFail(agent)
        this.shouldFailBeforeExpiry(agent, true)
      })
    })
  })
}
