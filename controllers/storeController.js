const productModel = require('../models/productModel.js')

exports.getTopSellingProducts=async(req,res)=>{
  try{
    const limit = 12

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
    const limit = 12
    const skipAmount = (req.body.page - 1) * limit
    const mostViewedProducts = await productModel.find({}, { productId: 1, name: 1, productImg1: 1, currency: 1, price: 1,discount: 1, _id: 0 }).sort({ views: -1 }).skip(skipAmount).limit(10)
    res.json({ mostViewedProducts:mostViewedProducts
       })

  }catch(err){
    console.log("error while fetching mostViewedProducts:",err)
  }

}
