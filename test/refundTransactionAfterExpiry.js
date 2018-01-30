const $util = require("./util")
const InkProtocol = artifacts.require("./mocks/InkProtocolMock.sol")
const ErrorPolicy = artifacts.require("./mocks/ErrorPolicyMock.sol")

contract("InkProtocol", (accounts) => {
  let buyer = accounts[1]
  let seller = accounts[2]
  let unknown = accounts[accounts.length - 1]

  describe("#refundTransactionAfterExpiry()", () => {
    it("fails for seller", async () => {
      let {
        policy,
        protocol,
        transaction
      } = await $util.buildTransaction(buyer, seller, {
        finalState: $util.states.Disputed
      })

      // let expiry = await policy.escalationExpiry()

      await $util.advanceTime(86400 * 6)

      await $util.assertVMExceptionAsync(protocol.refundTransactionAfterExpiry(transaction.id, { from: seller }))
    })

    it("fails for owner", async () => {
      let {
        policy,
        owner,
        protocol,
        transaction
      } = await $util.buildTransaction(buyer, seller, {
        finalState: $util.states.Disputed,
        owner: true
      })

      // let expiry = await policy.escalationExpiry()

      await $util.advanceTime(86400 * 6)

      await $util.assertVMExceptionAsync(owner.proxyRefundTransactionAfterExpiry(protocol.address, transaction.id))
    })

    it("fails for mediator", async () => {
      let {
        policy,
        mediator,
        protocol,
        transaction
      } = await $util.buildTransaction(buyer, seller, {
        finalState: $util.states.Disputed
      })

      // let expiry = await policy.escalationExpiry()

      await $util.advanceTime(86400 * 6)

      await $util.assertVMExceptionAsync(mediator.proxyRefundTransactionAfterExpiry(protocol.address, transaction.id))
    })

    it("fails for policy", async () => {
      let {
        policy,
        protocol,
        transaction
      } = await $util.buildTransaction(buyer, seller, {
        finalState: $util.states.Disputed
      })

      // let expiry = await policy.escalationExpiry()

      await $util.advanceTime(86400 * 6)

      await $util.assertVMExceptionAsync(policy.proxyRefundTransactionAfterExpiry(protocol.address, transaction.id))
    })

    it("fails for unknown address", async () => {
      let {
        policy,
        protocol,
        transaction
      } = await $util.buildTransaction(buyer, seller, {
        finalState: $util.states.Disputed
      })

      // let expiry = await policy.escalationExpiry()

      await $util.advanceTime(86400 * 6)

      await $util.assertVMExceptionAsync(protocol.refundTransactionAfterExpiry(transaction.id, { from: unknown }))
    })

    it("fails when transaction does not exist", async () => {
      let protocol = await InkProtocol.new()

      // let expiry = await policy.escalationExpiry()

      await $util.advanceTime(86400 * 6)

      await $util.assertVMExceptionAsync(protocol.refundTransactionAfterExpiry(0, {from: buyer}))
    })

    it("fails before escalation expiry", async () => {
      let {
        policy,
        protocol,
        transaction
      } = await $util.buildTransaction(buyer, seller, {
        finalState: $util.states.Disputed
      })

      await $util.assertVMExceptionAsync(protocol.refundTransactionAfterExpiry(transaction.id, { from: buyer }))
    })

    it("calls the policy for the escalation expiry", async () => {
      let {
        policy,
        protocol,
        transaction
      } = await $util.buildTransaction(buyer, seller, {
        finalState: $util.states.Disputed
      })

      // 6 days for escalationExpiry
      $util.advanceTime(86400 * 6)

      await protocol.refundTransactionAfterExpiry(transaction.id, { from: buyer })

      transaction = await $util.getTransaction(transaction.id, protocol)

      // It fails if using the default expiry
      assert.equal(transaction.state, $util.states.RefundedAfterExpiry)
    })

    it("sets escalation expiry to 0 when policy raises an error", async () => {
      let policy = await ErroredPolicy.new()

      let {
        protocol,
        transaction
      } = await $util.buildTransaction(buyer, seller, {
        finalState: $util.states.Disputed,
        policy: policy
      })

      await protocol.refundTransactionAfterExpiry(transaction.id, { from: buyer })

      transaction = await $util.getTransaction(transaction.id, protocol)

      // This passes without and time advance since the expiry is 0
      assert.equal(transaction.state, $util.states.RefundedAfterExpiry)
    })

    it("passes the transaction's amount to the mediator", async () => {

    })

    it("transfers the mediator fee to the mediator", async () => {

    })

    it("emits the TransactionRefundedAfterExpiry event", async () => {

    })

    it("transfers the tokens to the buyer", async () => {

    })

    it("collects 0 fee when mediator raises an error", async () => {

    })

    it("collects 0 fee when mediator returns a fee higher than the transaction amount", async () => {

    })
  })
})
