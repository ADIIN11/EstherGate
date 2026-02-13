const fs=require("fs")
const categoryModel = require('../models/categoryModel.js')
const productModel = require('../models/productModel.js')
const{
  uploadProductImage,
}=require("../services/cloudinaryService")

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
       res.json({ message:"successfully created new category"
       })
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
      res.json({ message:"successfully added type"
       })
    }catch(err){
      console.log("error while adding type:",err)
    }
}
exports.updateType=async(req,res)=>{
   console.log(req.body)

    const category=req.body.category
    const type=req.body.type
    const productId=req.body.productId
    try{
      await categoryModel.updateOne({category:category},{ $push: { [`types.${type}`]: productId } })
      res.json({ message:"successfully updated type"
       })
    }catch(err){
      console.log("error while updating type:",err)
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.createProduct=async(req,res)=>{
   console.log(req.body)
   try{
    const newProduct= new productModel(req.body)
    await newProduct.save().then(()=>console.log("New Product Saved")).catch(err=>console.log("Saving Error",err))
       res.json({ message:"successfully created new product"
       })
   }catch(err){
      console.log("error while creating product:",err)
    }
}

exports.uploadProductImage=async(req,res)=>{
  console.log(req.body)
  const productId=req.body.productId
  const imageNumber=req.body.imageNumber
   try {
    const response = await uploadProductImage(req.file.path,productId,imageNumber)

    await setProductImg(productId,imageNumber,response.secure_url,response.public_id)
    await fs.unlink(req.file.path, (err) => { 
      if (err) 
        console.error('Failed to delete temp file:', err
      ) 
    })

    res.json({ message:"successfully created new product"
       })

  }catch (err) {
    console.error(err)
    await fs.unlink(req.file.path, (unlinkErr) => { 
      if (unlinkErr) 
        console.error('Failed to delete temp file after error:', unlinkErr)
      })
    res.status(500).json({ error: "Upload failed" })
  }
}


async function setProductImg(productId,imageNumber,productImg,productImgPubId){
  try{
  await productModel.updateOne({productId:productId},{$set:{[`productImg${imageNumber}`]:productImg,[`productImg${imageNumber}PubId`]:productImgPubId}})
  }catch(err){
    console.log("error while setting profile img:",err)
  }
}