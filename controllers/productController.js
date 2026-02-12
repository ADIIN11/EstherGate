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

exports.createCategory=async(req,res)=>{
   console.log(req.body)

    const category=req.body.category
    const type=req.body.type
    const productId=req.body.productId

    const newCategoryObj={
        category: category,
        types:{[type]:[productId]}
    }
    try{
      const newCategory= new categoryModel(newCategoryObj)
      await newCategory.save().then(()=>console.log("New Category Saved")).catch(err=>console.log("Saving Error",err))
      }catch(err){
      console.log("error while creating category:",err)
    }
}

exports.getCategoryTypes=async(req,res)=>{
    const category=req.body.category
    let types=await categoryModel.find({category:category}).select('-_id types')
    console.log(types)
    types=types[0].types
    const typesList = Object.keys(types)
     res.json({ 
      types:typesList
     })

}

exports.addType=async(req,res)=>{
   console.log(req.body)

    const category=req.body.category
    const type=req.body.type
    const productId=req.body.productId
    try{
      await categoryModel.updateOne({category:category},{$set:{[`types.${type}`]:[productId]}})
    }catch(err){
      console.log("error while creating category:",err)
    }
}
exports.updateType=async(req,res)=>{
   console.log(req.body)

    const category=req.body.category
    const type=req.body.type
    const productId=req.body.productId
    try{
      await categoryModel.updateOne({category:category},{ $push: { [`types.${type}`]: productId } })
    }catch(err){
      console.log("error while creating category:",err)
    }
}