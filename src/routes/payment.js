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
 try{
    console.log("webhook called")
    const webhookSignature= req.get("X-Razorpay-Signature")
    const isWebhookValid = validateWebhookSignature(JSON.stringify(req.body), webhookSignature, process.env.WEBHOOK_SECRET);
    console.log(isWebhookValid)
    if(!isWebhookValid){
        return res.status(400).json({msg: "Webhook signature is invalid"})
    }
 //update the payment status in db
        //update the user as premium
        //return success response to razorpay
    const paymentDetails = req.body.payload.payment.entity

    const payment = await Payment.findOne({orderId: paymentDetails.order_id})
    payment.status = paymentDetails.status
    await payment.save();
    const user = await User.findOne({_id: payment.userId})
    console.log(user)
    user.isPremium = true
    user.membershipType = payment.notes.membershipType 
    await user.save()
     console.log(user)

    // if(req.body.event === "payment.captured"){
         
           
    // }
    // else if(req.body.event === "payment.failed"){
    //     //update the payment status in db
    // }

 }
 catch(error){    
    return res.status(500).json({msg: error.message})
 }
})


module.exports = paymentRouter;