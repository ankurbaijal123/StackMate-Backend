const mongoose = require('mongoose')
const { default: isEmail } = require('validator/lib/isEmail')
const validator = require("validator");
const paymentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true
        },
        paymentId: {
            type: String
        },
        orderId: {
       type: String,
            required: true
        },
        amount: {     
            type: Number,
            required: true
        },
        currency: {
            type: String,
            required: true
        },
        receipt: {
            type: String,
            required: true
        },
        notes: {
            firstName: {
                type: String,
            },
            lastName: {
                type: String
            },
            emailId: {
                type: String,
                validate(value) {
                    if (!validator.isEmail(value)) {
                        throw new Error("Invalid email format : " + value);
                    }
                },
            },
            membershipType: {
                type: String
            }
        },
        status: {
            type: String,
            required: true
        }
    }, { timestamps: true }
)
module.exports = mongoose.model("Payment", paymentSchema) 