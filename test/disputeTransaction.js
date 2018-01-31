const $util = require("./util")
const InkProtocol = artifacts.require("./mocks/InkProtocolMock.sol")
const ErrorPolicy = artifacts.require("./mocks/ErrorPolicyMock.sol")

contract("InkProtocol", (accounts) => {
  let buyer = accounts[1]
  let seller = accounts[2]
  let unknown = accounts[accounts.length - 1]

  describe("#disputeTransaction()", () => {
    it("fails for seller", async () => {
      let {
        protocol,
        transaction
      } = await $util.buildTransaction(buyer, seller, {
        finalState: $util.states.Accepted
      })

      await $util.assertVMExceptionAsync(protocol.disputeTransaction(transaction.id, { from: seller }))
    })

    it("fails for owner", async () => {
      let {
        protocol,
        owner,
        transaction
      } = await $util.buildTransaction(buyer, seller, {
        finalState: $util.states.Accepted,
        owner: true
      })

      await $util.assertVMExceptionAsync(owner.proxyDisputeTransaction(protocol.address, transaction.id))
    })

    it("fails for mediator", async () => {
      let {
        protocol,
        mediator,
        transaction
      } = await $util.buildTransaction(buyer, seller, {
        finalState: $util.states.Accepted
      })

      await $util.assertVMExceptionAsync(mediator.proxyDisputeTransaction(protocol.address, transaction.id))
    })

    it("fails for policy", async () => {
      let {
        protocol,
        policy,
        transaction
      } = await $util.buildTransaction(buyer, seller, {
        finalState: $util.states.Accepted
      })

      await $util.assertVMExceptionAsync(policy.proxyDisputeTransaction(protocol.address, transaction.id))
    })

    it("fails for unknown address", async () => {
      let {
        protocol,
        transaction
      } = await $util.buildTransaction(buyer, seller, {
        finalState: $util.states.Accepted
      })

      await $util.assertVMExceptionAsync(protocol.disputeTransaction(transaction.id, { from: unknown }))
    })

    it("fails when transaction does not exist", async () => {
      let protocol = await InkProtocol.new()

      await $util.assertVMExceptionAsync(protocol.disputeTransaction(0, {from: buyer}))
    })

    it("fails before fulfillment expiry", async () => {
      let {
        policy,
        protocol,
        transaction
      } = await $util.buildTransaction(buyer, seller, {
        finalState: $util.states.Accepted
      })

      let fulfillmentExpiry = await policy.fulfillmentExpiry()
      // 10 seconds before expiry
      $util.advanceTime(fulfillmentExpiry.toNumber() - 10)

      await $util.assertVMExceptionAsync(protocol.disputeTransaction(transaction.id, {from: buyer}))
    })

    it("calls the policy for the fulfillment expiry", async () => {
      let {
        protocol,
        transaction
      } = await $util.buildTransaction(buyer, seller, {
        finalState: $util.states.Accepted
      })

      // 7 days for fulfillmentExpiry
      $util.advanceTime(86400 * 7)

      await protocol.disputeTransaction(transaction.id, { from: buyer })

      let txn = await $util.getTransaction(transaction.id, protocol)

      // It fails if using the default fulfillment expiry
      assert.equal(txn.state, $util.states.Disputed)
    })

    it("sets fulfillment expiry to 0 when policy raises an error", async () => {
      let policy = await ErrorPolicy.new()
      let {
        protocol,
        transaction
      } = await $util.buildTransaction(buyer, seller, {
        finalState: $util.states.Accepted,
        policy: policy
      })

      await protocol.disputeTransaction(transaction.id, {from: buyer})

      let txn = await $util.getTransaction(transaction.id, protocol)

      // This passes without and time advance since the expiry is 0
      assert.equal(txn.state, $util.states.Disputed)
    })

    it("emits the TransactionDisputed event", async () => {
      let {
        policy,
        protocol,
        transaction
      } = await $util.buildTransaction(buyer, seller, {
        finalState: $util.states.Accepted
      })

      let fulfillmentExpiry = await policy.fulfillmentExpiry()
      $util.advanceTime(fulfillmentExpiry.toNumber())

      let tx = await protocol.disputeTransaction(transaction.id, {from: buyer})
      let eventArgs = $util.eventFromTx(tx, $util.events.TransactionDisputed).args

      assert.equal(eventArgs.id.toNumber(), transaction.id)
    })
  })
})
