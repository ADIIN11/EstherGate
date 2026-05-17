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


exports.getOnSaleProducts = async (req, res) => {
  try {
    const limit = 12
    const skipAmount = (req.body.page - 1) * limit
    
    const onSaleProducts = await productModel
      .find(
        { discount: { $gt: 0 } }, 
        { productId: 1, name: 1, productImg1: 1, currency: 1, price: 1, discount: 1, _id: 0 }
      )
      .sort({ discount: -1 }) 
      .skip(skipAmount)
      .limit(limit) 

    res.json({ 
      onSaleProducts: onSaleProducts 
    })

  } catch (err) {
    console.log("error while fetching onSaleProducts:", err)
    res.status(500).json({ error: "An error occurred while fetching on sale products" })
  }
}



exports.searchProducts = async (req, res) => {
  try {
    const searchTerm = req.body.searchTerm || ""
    const page = parseInt(req.body.page) || 1
    
    const limit = 10 
    const skipAmount = (page - 1) * limit

    if (!searchTerm.trim()) {
      return res.json({ products: [] })
    }

    let products = []
    
    const textSearchCount = await productModel.countDocuments({
      $text: { $search: searchTerm }
    })

    if (textSearchCount > 0) {
      products = await productModel.find(
        { $text: { $search: searchTerm } },
        { score: { $meta: "textScore" } } 
      )
      .sort({ score: { $meta: "textScore" } }) 
      .skip(skipAmount)
      .limit(limit)
    } else {
      const searchRegex = new RegExp(searchTerm, 'i')
      
      products = await productModel.find({
        $or: [
          { name: { $regex: searchRegex } },
          { sellerName: { $regex: searchRegex } },
          { category: { $regex: searchRegex } },
          { type: { $regex: searchRegex } },
          { tags: { $in: [searchRegex] } } 
        ]
      })
      .skip(skipAmount)
      .limit(limit)
    }

    res.json({ products: products })

  } catch (err) {
    console.log("Error searching products:", err)
    res.status(500).json({ error: "Failed to search products" })
  }
}