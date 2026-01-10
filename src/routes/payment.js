const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
//const { default: orders } = require("razorpay/dist/types/orders");
const payment = require("../models/payment");
const { memberShipAmount } = require("../utils/constanst");
paymentRouter.post("/payment/create", userAuth, async (req, res) => { 
    console.log(req)  
    try {
        const {type} = req.body
        const {firstName, lastName, emailId} = req.user;
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
        const Payment = new payment({
            userId: req.user._id,
            orderId: order.id,
            status: order.status,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,   
            notes: order.notes
        })

        const savedPayment = await Payment.save()

        // return back my order details to frontend 
        res.json({ ...savedPayment.toJSON()})
    } 

    catch (err) {
        return res.status(500).json({ msg: err.message })
    }
})


module.exports = paymentRouter;