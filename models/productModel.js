const mongoose = require('mongoose')



const productSchema=new mongoose.Schema({
    productId: String,
    name: String,
    fullName:String,
    price: Number,
    currency:String,
    createdAt: String,
    sellerId: String,
    sellerName:String,
    category: String,
    type: String,
    description:String,
    tags:Array,
    inventory:Number,
    discount:Number,
    views:Number,
    addedToCart:Number,
    productBought:Number,
    ratings:Number,
    noCustomersReviewed:Number,
    customerReviews:Array,
    productImg1:String,
    productImg1PubId:String,
    productImg2:String,
    productImg2PubId:String,
    productImg3:String,
    productImg3PubId:String,
    productImg4:String,
    productImg4PubId:String,
    productImg5:String,
    productImg5PubId:String,
    
  },{ versionKey: false })
  
 module.exports = mongoose.models.Product ||mongoose.model("Product",productSchema,"products")

