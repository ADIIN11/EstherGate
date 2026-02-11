const fs=require("fs")
const categoryModel = require('../models/categoryModel')


exports.getcategories=async(req,res)=>{
   try{
    const categories= await categoryModel.find().select('-_id category ')
    const categoryList=categories.map(user => user.category)
    res.json({ categories:categoryList
  })
  }catch(err){
    console.log("error while sending profileimg:",err)
  }
}
