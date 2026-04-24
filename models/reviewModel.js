const mongoose = require('mongoose')



const reviewSchema=new mongoose.Schema({
     reviewId:String,
      userId:String,
      username:String,
      productId:String,
      rating:Number,
      review:String,
      reviewLiked:Number,
      createdAt: String
  },{ versionKey: false })
  
 module.exports = mongoose.models.Review ||mongoose.model("Review",reviewSchema,"reviews")