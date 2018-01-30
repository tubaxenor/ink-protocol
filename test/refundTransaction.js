const $util = require("./util")
const InkProtocol = artifacts.require("./mocks/InkProtocolMock.sol")

contract("InkProtocol", (accounts) => {
  let buyer = accounts[1]
  let seller = accounts[2]
  let unknown = accounts[accounts.length - 1]

  describe("#refundTransaction()", () => {
    // it("fails for buyer", async () => {
    //   let {
    //     protocol,
    //     transaction
    //   } = await $util.buildTransaction(buyer, seller, {
    //     finalState: $util.states.Accepted
    //   })
    //
    //   await $util.assertVMExceptionAsync(protocol.refundTransaction(transaction.id, { from: buyer }))
    // })
    //
    // it("fails for owner", async () => {
    //   let {
    //     owner,
    //     protocol,
    //     transaction
    //   } = await $util.buildTransaction(buyer, seller, {
    //     finalState: $util.states.Accepted,
    //     owner: true
    //   })
    //
    //   await $util.assertVMExceptionAsync(owner.proxyRefundTransaction(protocol.address, transaction.id))
    // })
    //
    // it("fails for mediator", async () => {
    //   let {
    //     mediator,
    //     protocol,
    //     transaction
    //   } = await $util.buildTransaction(buyer, seller, {
    //     finalState: $util.states.Accepted
    //   })
    //
    //   await $util.assertVMExceptionAsync(mediator.proxyRefundTransaction(protocol.address, transaction.id))
    // })
    //
    // it("fails for policy", async () => {
    //   let {
    //     policy,
    //     protocol,
    //     transaction
    //   } = await $util.buildTransaction(buyer, seller, {
    //     finalState: $util.states.Accepted
    //   })
    //
    //   await $util.assertVMExceptionAsync(policy.proxyRefundTransaction(protocol.address, transaction.id))
    // })
    //
    // it("fails for unknown address", async () => {
    //   let {
    //     protocol,
    //     transaction
    //   } = await $util.buildTransaction(buyer, seller, {
    //     finalState: $util.states.Accepted
    //   })
    //
    //   await $util.assertVMExceptionAsync(protocol.refundTransaction(transaction.id, { from: unknown }))
    // })
    //
    // it("fails when transaction does not exist", async () => {
    //   let protocol = await InkProtocol.new()
    //
    //   await $util.assertVMExceptionAsync(protocol.refundTransaction(0, {from: seller}))
    // })

    describe("when state is Accepted", () => {
      it("passes the transaction's amount to the mediator", async () => {
        let {
          mediator,
          protocol,
          transaction
        } = await $util.buildTransaction(buyer, seller, {
          finalState: $util.states.Accepted
        })

        let tx = await protocol.refundTransaction(transaction.id, { from: seller })

        let event = await $util.eventFromContract(mediator, "RefundTransactionFeeCalled")

        assert.equal(event.args.transactionAmount.toNumber(), transaction.amount.toNumber())
      })

      it("transfers the mediator fee to the mediator", async () => {
        let {
          mediator,
          protocol,
          transaction
        } = await $util.buildTransaction(buyer, seller, {
          finalState: $util.states.Accepted
        })

        let fee = 10

        mediator.setRefundTransactionFeeResponse(fee)

        originalMediatorBalance = await $util.getBalance(mediator.address, protocol)

        let tx = await protocol.refundTransaction(transaction.id, { from: seller })

        assert.equal(await $util.getBalance(mediator.address, protocol), originalMediatorBalance + fee)
      })

      it("emits the TransactionRefunded event", async () => {
        let {
          protocol,
          transaction
        } = await $util.buildTransaction(buyer, seller, {
          finalState: $util.states.Accepted
        })

        let tx = await protocol.refundTransaction(transaction.id, { from: seller })

        let eventArgs = $util.eventFromTx(tx, $util.events.TransactionRefunded).args

        assert.equal(eventArgs.id, transaction.id)
      })

      it("transfers the tokens to the buyer", async () => {
        let {
          protocol,
          transaction
        } = await $util.buildTransaction(buyer, seller, {
          finalState: $util.states.Accepted
        })

        originalBuyerBalance = await $util.getBalance(buyer, protocol)

        let tx = await protocol.refundTransaction(transaction.id, { from: seller })

        assert.equal(await $util.getBalance(buyer, protocol), transaction.amount.toNumber())
      })

      it("collects 0 fee when mediator raises an error", async () => {
        let {
          mediator,
          protocol,
          transaction
        } = await $util.buildTransaction(buyer, seller, {
          finalState: $util.states.Accepted
        })

        let fee = 10

        mediator.setRaiseError(true)

        mediator.setRefundTransactionFeeResponse(fee)

        let tx = await protocol.refundTransaction(transaction.id, { from: seller })

        assert.equal(await $util.getBalance(mediator.address, protocol), 0)
      })

      it("collects 0 fee when mediator returns a fee higher than the transaction amount", async () =>{
        let {
          mediator,
          protocol,
          transaction
        } = await $util.buildTransaction(buyer, seller, {
          finalState: $util.states.Accepted
        })

        let fee = transaction.amount + 10

        mediator.setRefundTransactionFeeResponse(fee)

        let tx = await protocol.refundTransaction(transaction.id, { from: seller })

        assert.equal(await $util.getBalance(mediator.address, protocol).toNumber(), 0)
      })
    })

    describe("when state is Disputed", () => {
      it("passes the transaction's amount to the mediator")
      it("transfers the mediator fee to the mediator")
      it("emits the TransactionRefundedAfterDispute event")
      it("transfers the tokens to the buyer")
      it("collects 0 fee when mediator raises an error")
      it("collects 0 fee when mediator returns a fee higher than the transaction amount")
    })

    describe("when state is Escalated", () => {
      it("fails before mediation expiry")
      it("calls the mediator for the mediation expiry")
      it("sets mediation expiry to 0 when mediator raises an error")
      it("passes the transaction's amount to the mediator")
      it("transfers the mediator fee to the mediator")
      it("emits the TransactionRefundedAfterEscalation event")
      it("transfers the tokens to the buyer")
      it("collects 0 fee when mediator raises an error")
      it("collects 0 fee when mediator returns a fee higher than the transaction amount")
    })
  })
})
