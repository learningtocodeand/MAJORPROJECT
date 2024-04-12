const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user.js");

const reviewSchema=new Schema({
    comment:String,
    ratings:{
        type:Number,
        min:1,
        max:5,
    },
    createAt:{
        type:Date,
        default:Date.now(),
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
})

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;