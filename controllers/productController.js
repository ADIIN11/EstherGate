const fs=require("fs")
const categoryModel = require('../models/categoryModel.js')
const productModel = require('../models/productModel.js')
const userModel = require('../models/userModel.js')
const reviewModel = require('../models/reviewModel.js')
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
   const productId=req.body.productId
   const sellerId=req.body.sellerId

    try{
      await userModel.updateOne({ id: sellerId }, { $push: { productListed: productId } })
    }catch(err){
        console.log("error while updating productListed in user document:",err)
        return
    }

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




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.getTopSellingProducts=async(req,res)=>{
  try{
    const limit = 10

    const skipAmount = (req.body.page - 1) * limit
    const topSellingProducts = await productModel.find({}, { productId: 1, name: 1, productImg1: 1, currency: 1, price: 1,discount: 1, _id: 0 }).sort({ productBought: -1 }).skip(skipAmount).limit(limit)
    res.json({ topSellingProducts:topSellingProducts
       })

  }catch(err){
    console.log("error while fetching topSellingProducts:",err)
  }

}

exports.getMostViewedProducts=async(req,res)=>{
  try{
    const limit = 10
    const skipAmount = (req.body.page - 1) * limit
    const mostViewedProducts = await productModel.find({}, { productId: 1, name: 1, productImg1: 1, currency: 1, price: 1,discount: 1, _id: 0 }).sort({ views: -1 }).skip(skipAmount).limit(10)
    res.json({ mostViewedProducts:mostViewedProducts
       })

  }catch(err){
    console.log("error while fetching mostViewedProducts:",err)
  }

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.getProduct=async(req,res)=>{
  const productId=req.params.productId
  incrementProductKey(productId, "views")
  try{
    const product = await productModel.findOne({ productId: productId },{ _id: 0 })
    if (!product) { 
      console.log("Product not found"); 
      res.json({ 
        product:product
       })
    }
    let productReviews
    const customerReviews=product.customerReviews

    for(let i=1;i<=customerReviews.length;i++){
      try{
     productReviews += await reviewModel.findOne({ reviewId: customerReviews[i-1].reviewId },{ _id: 0 })
          }catch(err){
          console.log("error while fetching product reviews:",err)
        }
    
      }
    
    
    res.json({ 
        product:product,
        productReviews:productReviews
       })
  }catch(err){
    console.log("error while fetching product:",err)
  }

}





async function incrementProductKey(productId, key) {
  try {
    const result = await productModel.updateOne(
      { productId: productId },          
      { $inc: { [key]: 1 } }             
    )

    console.log("Update result:", result.acknowledged)
  } catch (error) {
    console.error("Error updating product key:", error)
  }
}


exports.submitReview=async(req,res)=>{
  const reviewObj=req.body
  console.log(reviewObj)
  const reviewId=reviewObj.reviewId
  const productId=reviewObj.productId
  const rating=reviewObj.rating
  const userId=reviewObj.userId

  const productReviewObj={
    reviewId:reviewId,
    rating:rating
  }
  const productObj={
    productId:productId
  }
  try{
    const newReview= new reviewModel(reviewObj)
    await newReview.save().then(()=>console.log("New review Saved")).catch(err=>console.log("Saving Error",err))
  }catch(err){
    console.log("Error while creating review",err)
    return
  }
  try{
    await productModel.updateOne({ productId: productId }, { $push: { customerReviews: productReviewObj } })
  }catch(err){
  console.log("Error while linking review to product",err)
  return
  }
  try{
    await userModel.updateOne({ id: userId }, { $push: { reviewsWritten: productId } })
  }catch(err){
  console.log("Error while linking review to user",err)
  return
  }
  try{
    const customerReviews=await getProductReviews(productObj)
    const noCustomersReviewed=customerReviews.length
    const ratings=getAverageRating(customerReviews)
    await productModel.updateOne({ productId: productId }, { $set: { noCustomersReviewed: noCustomersReviewed,ratings:ratings } })
  }catch(err){
  console.log("Error while updating product rating",err)
  return
  }

  res.json({ 
    message:"successfully created new product review"
       })


}

function getAverageRating(reviews) {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    console.warn("getAverageRating was passed invalid data:", reviews);
    return 0; 
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
  const average = totalRating / reviews.length
  return Number(average.toFixed(1))
}



async function getProductReviewsDB(productObj){
  try{
      const customerReviews= await productModel.find({productId:productObj.productId}).select('-_id customerReviews')
      return customerReviews
      }catch(err){
        console.log("did not find customerReviews :",err)
      }
    
}

async function getProductReviews(productObj){
  let customerReviews=await getProductReviewsDB(productObj)
  customerReviews=customerReviews[0].customerReviews
  return customerReviews
}
