const $ink = require("./utils")
const InkProtocolMock = artifacts.require("./mocks/InkProtocolMock.sol")
const MediatorMock = artifacts.require("./mocks/MediatorMock.sol")
const PolicyMock = artifacts.require("./mocks/PolicyMock.sol")
const commaNumber = require("comma-number")

module.exports = (accounts) => {
  let token, mediator, policy
  let buyer = accounts[1]
  let seller = accounts[2]
  let agent = accounts[3]
  let amount = 100
  metadata = $ink.metadataToHash({title: "Title"})

  beforeEach(async () => {
    token = await InkProtocolMock.new()
    mediator = await MediatorMock.new()
    policy = await PolicyMock.new()
  })

  describe('#createTransactionForBuyer()', () => {
    this.shouldCreateTheTransactionForBuyer = (sender) => {
      it("creates a transaction for buyer", async () => {
        await token.transfer(buyer, amount)

        let tx = await token.createTransactionForBuyer(buyer, seller, amount, metadata, policy.address, mediator.address, { from: sender })
        let eventArgs = $ink.eventFromTx(tx, $ink.events.TransactionInitiated).args

        assert.equal(eventArgs.id.toNumber(), 0)
        assert.equal(eventArgs.creator, sender)
        assert.equal(eventArgs.buyer, buyer)
        assert.equal(eventArgs.seller, seller)
        assert.equal(eventArgs.policy, policy.address)
        assert.equal(eventArgs.mediator, mediator.address)
        assert.equal(eventArgs.amount.toNumber(), amount)
        assert.equal(eventArgs.metadata, metadata)

        let transaction = await $ink.getTransaction(eventArgs.id.toNumber(), token)

        assert.equal(transaction.creator, sender)
        assert.equal(transaction.buyer, buyer)
        assert.equal(transaction.seller, seller)
        assert.equal(transaction.policy, policy.address)
        assert.equal(transaction.mediator, mediator.address)
        assert.equal(transaction.state, $ink.states.Initiated)
        assert.equal(transaction.amount, amount)
        assert.equal(transaction.metadata, metadata)

        assert.equal(await $ink.getBalance(token.address, token), amount)
        assert.equal(transaction.state, $ink.states.Initiated)
      })

      it("creates a transaction without mediator for buyer", async () => {
        await token.transfer(buyer, amount)

        let tx = await token.createTransactionForBuyer(buyer, seller, amount, metadata, 0, 0, { from: sender })
        let eventArgs = $ink.eventFromTx(tx, $ink.events.TransactionInitiated).args

        assert.equal(eventArgs.id.toNumber(), 0)
        assert.equal(eventArgs.creator, sender)
        assert.equal(eventArgs.buyer, buyer)
        assert.equal(eventArgs.seller, seller)
        assert.equal(eventArgs.policy, 0)
        assert.equal(eventArgs.mediator, 0)
        assert.equal(eventArgs.amount.toNumber(), amount)
        assert.equal(eventArgs.metadata, metadata)

        let transaction = await $ink.getTransaction(eventArgs.id.toNumber(), token)

        assert.equal(transaction.creator, sender)
        assert.equal(transaction.buyer, buyer)
        assert.equal(transaction.seller, seller)
        assert.equal(transaction.policy, 0)
        assert.equal(transaction.mediator, 0)
        assert.equal(transaction.state, $ink.states.Initiated)
        assert.equal(transaction.amount, amount)
        assert.equal(transaction.metadata, metadata)

        assert.equal(await $ink.getBalance(token.address, token), amount)
        assert.equal(transaction.state, $ink.states.Initiated)
      })
    }

    this.shouldFail = (sender) => {
      it("fails", async () => {
        await token.transfer(buyer, amount)

        await $ink.assertVMExceptionAsync("revert", token.createTransactionForBuyer(buyer, seller, amount, metadata, policy.address, mediator.address, { from: sender }))
      })
    }

    context("when create transaction for buyer by buyer", () => {
      // Buyer also as an authorized agent by himself
      this.shouldCreateTheTransactionForBuyer(buyer)
    })

    context("when create transaction for buyer by seller", () => {
      this.shouldFail(seller)
    })

    context("when create transaction for buyer by authorized agent", () => {
      beforeEach(async () => {
        await token.authorize(agent, { from: buyer })
      })
      this.shouldCreateTheTransactionForBuyer(agent)
    })

    context("when create transaction for buyer by unauthorized agent", () => {
      this.shouldFail(agent)
    })
  })
}
