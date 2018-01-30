const $util = require("./util")
const InkProtocol = artifacts.require("./mocks/InkProtocolMock.sol")

contract("InkProtocol", (accounts) => {
  let buyer = accounts[1]
  let seller = accounts[2]
  let unknown = accounts[accounts.length - 1]

  describe("#refundTransaction()", () => {
    it("fails for buyer", async () => {
      let {
        protocol,
        transaction
      } = await $util.buildTransaction(buyer, seller, {
        finalState: $util.states.Accepted
      })

      await $util.assertVMExceptionAsync(protocol.refundTransaction(transaction.id, { from: buyer }))
    })

    it("fails for owner", async () => {
      let {
        owner,
        protocol,
        transaction
      } = await $util.buildTransaction(buyer, seller, {
        finalState: $util.states.Accepted,
        owner: true
      })

      await $util.assertVMExceptionAsync(owner.proxyRefundTransaction(protocol.address, transaction.id))
    })

    it("fails for mediator", async () => {
      let {
        mediator,
        protocol,
        transaction
      } = await $util.buildTransaction(buyer, seller, {
        finalState: $util.states.Accepted
      })

      await $util.assertVMExceptionAsync(mediator.proxyRefundTransaction(protocol.address, transaction.id))
    })

    it("fails for policy", async () => {
      let {
        policy,
        protocol,
        transaction
      } = await $util.buildTransaction(buyer, seller, {
        finalState: $util.states.Accepted
      })

      await $util.assertVMExceptionAsync(policy.proxyRefundTransaction(protocol.address, transaction.id))
    })

    it("fails for unknown address", async () => {
      let {
        protocol,
        transaction
      } = await $util.buildTransaction(buyer, seller, {
        finalState: $util.states.Accepted
      })

      await $util.assertVMExceptionAsync(protocol.refundTransaction(transaction.id, { from: unknown }))
    })

    it("fails when transaction does not exist", async () => {
      let protocol = await InkProtocol.new()

      await $util.assertVMExceptionAsync(protocol.refundTransaction(0, {from: seller}))
    })

    describe("when state is Accepted", () => {
      it("passes the transaction's amount to the mediator", async () => {
        let {
          mediator,
          protocol,
          transaction
        } = await $util.buildTransaction(buyer, seller, {
          finalState: $util.states.Accepted
        })

        await protocol.refundTransaction(transaction.id, { from: seller })

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

        let originalMediatorBalance = await $util.getBalance(mediator.address, protocol)

        await protocol.refundTransaction(transaction.id, { from: seller })

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

        let originalBuyerBalance = await $util.getBalance(buyer, protocol)

        await protocol.refundTransaction(transaction.id, { from: seller })

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

        await protocol.refundTransaction(transaction.id, { from: seller })

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

        assert.equal(await $util.getBalance(mediator.address, protocol), 0)
      })
    })

    describe("when state is Disputed", () => {
      it("passes the transaction's amount to the mediator", async () => {
        let {
          mediator,
          protocol,
          transaction
        } = await $util.buildTransaction(buyer, seller, {
          finalState: $util.states.Disputed
        })

        await protocol.refundTransaction(transaction.id, { from: seller })

        let event = await $util.eventFromContract(mediator, "RefundTransactionAfterDisputeFeeCalled")

        assert.equal(event.args.transactionAmount.toNumber(), transaction.amount.toNumber())
      })

      it("transfers the mediator fee to the mediator", async () => {
        let {
          mediator,
          protocol,
          transaction
        } = await $util.buildTransaction(buyer, seller, {
          finalState: $util.states.Disputed
        })

        let fee = 10

        mediator.setRefundTransactionAfterDisputeFeeResponse(fee)

        let originalMediatorBalance = await $util.getBalance(mediator.address, protocol)

        await protocol.refundTransaction(transaction.id, { from: seller })

        assert.equal(await $util.getBalance(mediator.address, protocol), originalMediatorBalance + fee)
      })

      it("emits the TransactionRefundedAfterDispute event", async () => {
        let {
          protocol,
          transaction
        } = await $util.buildTransaction(buyer, seller, {
          finalState: $util.states.Disputed
        })

        let tx = await protocol.refundTransaction(transaction.id, { from: seller })

        let eventArgs = $util.eventFromTx(tx, $util.events.TransactionRefundedAfterDispute).args

        assert.equal(eventArgs.id, transaction.id)
      })

      it("transfers the tokens to the buyer", async () => {
        let {
          protocol,
          transaction
        } = await $util.buildTransaction(buyer, seller, {
          finalState: $util.states.Disputed
        })

        let originalBuyerBalance = await $util.getBalance(buyer, protocol)

        await protocol.refundTransaction(transaction.id, { from: seller })

        assert.equal(await $util.getBalance(buyer, protocol), transaction.amount.toNumber())
      })

      it("collects 0 fee when mediator raises an error", async () => {
        let {
          mediator,
          protocol,
          transaction
        } = await $util.buildTransaction(buyer, seller, {
          finalState: $util.states.Disputed
        })

        let fee = 10

        mediator.setRaiseError(true)

        mediator.setRefundTransactionAfterDisputeFeeResponse(fee)

        await protocol.refundTransaction(transaction.id, { from: seller })

        assert.equal(await $util.getBalance(mediator.address, protocol), 0)
      })

      it("collects 0 fee when mediator returns a fee higher than the transaction amount", async () => {
        let {
          mediator,
          protocol,
          transaction
        } = await $util.buildTransaction(buyer, seller, {
          finalState: $util.states.Disputed
        })

        let fee = transaction.amount + 10

        mediator.setRefundTransactionAfterDisputeFeeResponse(fee)

        await protocol.refundTransaction(transaction.id, { from: seller })

        assert.equal(await $util.getBalance(mediator.address, protocol), 0)
      })
    })

    describe("when state is Escalated", () => {
      it("fails before mediation expiry", async () => {
        let {
          mediator,
          protocol,
          transaction
        } = await $util.buildTransaction(buyer, seller, {
          finalState: $util.states.Escalated
        })

        // Set expiry to an hour
        mediator.setMediationExpiryResponse(600)

        await $util.assertVMExceptionAsync(protocol.refundTransaction(transaction.id, { from: seller }))
      })

      it("calls the mediator for the mediation expiry", async () => {
        let {
          mediator,
          protocol,
          transaction
        } = await $util.buildTransaction(buyer, seller, {
          finalState: $util.states.Escalated
        })

        mediator.setMediationExpiryResponse(60)

        $util.advanceTime(60)

        await protocol.refundTransaction(transaction.id, { from: seller })

        let event = await $util.eventFromContract(mediator, "MediationExpiryCalled")
      })

      it("sets mediation expiry to 0 when mediator raises an error", async () => {
        let {
          mediator,
          protocol,
          transaction
        } = await $util.buildTransaction(buyer, seller, {
          finalState: $util.states.Escalated
        })

        // Set expiry to an hour
        mediator.setMediationExpiryResponse(600)

        mediator.setRaiseError(true)

        await protocol.refundTransaction(transaction.id, { from: seller })

        // Transfers means expiry happens instantly
        assert.equal(await $util.getBalance(buyer, protocol), transaction.amount.toNumber())
      })

      it("emits the TransactionRefundedAfterEscalation event", async () => {
        let {
          mediator,
          protocol,
          transaction
        } = await $util.buildTransaction(buyer, seller, {
          finalState: $util.states.Escalated
        })

        mediator.setMediationExpiryResponse(600)

        $util.advanceTime(600)

        let tx = await protocol.refundTransaction(transaction.id, { from: seller })

        let eventArgs = $util.eventFromTx(tx, $util.events.TransactionRefundedAfterEscalation).args

        assert.equal(eventArgs.id, transaction.id)
      })

      it("transfers the tokens to the buyer", async () => {
        let {
          mediator,
          protocol,
          transaction
        } = await $util.buildTransaction(buyer, seller, {
          finalState: $util.states.Escalated
        })

        mediator.setMediationExpiryResponse(600)

        $util.advanceTime(600)

        let originalBuyerBalance = await $util.getBalance(buyer, protocol)

        await protocol.refundTransaction(transaction.id, { from: seller })

        assert.equal(await $util.getBalance(buyer, protocol), transaction.amount.toNumber())
      })
    })
  })
})
