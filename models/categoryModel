const mongoose = require('mongoose')



const categorySchema=new mongoose.Schema({
    category:String,
    types:Object
  },{ versionKey: false })
  
 module.exports = mongoose.models.Category ||mongoose.model("Category",categorySchema,"categories")

