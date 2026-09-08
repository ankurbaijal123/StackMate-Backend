const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
//const { default: orders } = require("razorpay/dist/types/orders");
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils')
const Payment = require("../models/payment");
const User = require("../models/user")
const { memberShipAmount } = require("../utils/constanst");
paymentRouter.post("/payment/create", userAuth, async (req, res) => {
    console.log(req)
    try {
        const { type } = req.body
        const { firstName, lastName, emailId } = req.user;
        const order = await razorpayInstance.orders.create({
            "amount": memberShipAmount[type] * 100, //given in paisa
            "currency": "INR",
            "receipt": "receipt#1",
            "notes": {
                "firstName": firstName,
                "lastName": lastName,
                "emailId": emailId,
                "membershipType": type
            }
        }) // will return the promise and create an order

        // save it in my database 
        console.log(order)
        const payment = new Payment({
            userId: req.user._id,
            orderId: order.id,
            status: order.status,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            notes: order.notes
        })

        const savedPayment = await payment.save()

        // return back my order details to frontend 
        res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID })
    }

    catch (err) {
        return res.status(500).json({ msg: err.message })
    }
})

paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSignature = req.get("X-Razorpay-Signature");
    const rawBody = req.body.toString("utf8");
    const isWebhookValid = validateWebhookSignature(
      rawBody,
      webhookSignature,
      process.env.WEBHOOK_SECRET
    );

    if (!isWebhookValid) {
      return res.status(400).json({ message: "Webhook signature is invalid" });
    }

    const event = JSON.parse(rawBody);

    // Only a successfully captured payment grants premium access.
    if (event.event !== "payment.captured") {
      return res.status(200).json({ received: true });
    }

    const paymentDetails = event.payload.payment.entity;
    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });

    if (!payment) {
      return res.status(404).json({ message: "Payment order not found" });
    }

    // Razorpay can deliver the same event more than once.
    if (payment.status === "captured") {
      return res.status(200).json({ received: true });
    }

    payment.status = paymentDetails.status;
    await payment.save();

    const user = await User.findById(payment.userId);
    if (!user) {
      return res.status(404).json({ message: "Payment user not found" });
    }

    user.isPremium = true;
    user.membershipType = payment.notes.membershipType;
    await user.save();

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    return res.status(500).json({ message: "Webhook processing failed" });
  }
})

paymentRouter.get("/payment/verify", userAuth, async(req,res) => {
    const user = req.user;
    if(user.isPremium === true){
        return res.json({isPremium:true})
    }
    else{
        return res.json({isPremium:false})
    }
})


module.exports = paymentRouter;
