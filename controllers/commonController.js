const userModel = require('../models/userModel.js')
const productModel = require('../models/productModel.js')
const {
    verifyTokenSignIn,
    isTokenRevoked,
    revokeToken,
}=require("../services/tokenService")



exports.tokenVerification=async (req, res) => {
  const tokenObj=req.body
  console.log(tokenObj)
  const token=tokenObj.token
  if (isTokenRevoked(token)){
    return res.json({ tokenVerified:false })
  }
  const userData=await verifyTokenSignIn(tokenObj)
  if(userData){
    // const username=userData.username
    // const role=userData.role
    const id=userData.id

    res.json({ tokenVerified:true,
      // username:username,
      // role:role,
      id:id
    })}
  else{
    res.json({ tokenVerified:false })
  }
}

exports.userSignOut=(req, res) => {
 
  const tokenObj = req.body
  const token=tokenObj.token
  revokeToken(token) 
  res.json({ message: "Token revoked" }) 
}

exports.getProfileImage=async (req, res) => {
  try{
  const profileImg=await getProfileImg(req.body)
  const ProfileUsername=await getProfileUsername(req.body)
  const myCart=await getProfileCart(req.body)
  const myCartTotal = myCart.reduce((sum, currentItem) => {
  return sum + currentItem.quantity;
}, 0)
  res.json({ profileImg:profileImg,
    username:ProfileUsername,
    myCartItemNo:myCartTotal
  })
  }catch(err){
    console.log("error while sending profileimg:",err)
  }
}


async function getProfileImgDB(userObj){
  try{
      const profileImg= await userModel.find({id:userObj.id}).select('-_id profileImg')
      return profileImg
      }catch(err){
        console.log("did not find profileImg :",err)
      }
    
}

async function getProfileImg(userObj){
  let profileImg=await getProfileImgDB(userObj)
  profileImg=profileImg[0].profileImg
  return profileImg
}

async function getProfileCartDB(userObj){
  try{
      const myCart= await userModel.find({id:userObj.id}).select('-_id myCart')
      return myCart
      }catch(err){
        console.log("did not find myCart :",err)
      }
    
}

async function getProfileCart(userObj){
  let myCart=await getProfileCartDB(userObj)
  myCart=myCart[0].myCart
  return myCart
}

async function getProfileUsernameDB(userObj){
  try{
      const profileUsername= await userModel.find({id:userObj.id}).select('-_id username')
      return profileUsername
      }catch(err){
        console.log("did not find profile username :",err)
      }
    
}

async function getProfileUsername(userObj){
  let profileUsername=await getProfileUsernameDB(userObj)
  profileUsername=profileUsername[0].username
  return profileUsername
}


exports.addProductToCart=async (req,res)=>{
  const userId=req.body.userId
  const productId=req.body.productId
  try{
    const result = await userModel.updateOne(
  { id: userId, "myCart.productId": productId },
  { $inc: { "myCart.$.quantity": 1 } }
  )
  if (result.matchedCount === 0) {
    await userModel.updateOne(
      { id: userId },
      { $push: { myCart: { productId: productId, quantity: 1 } } }
    )
  }
    res.json({ message:"product successfully added to cart"})
  }catch(err){
    console.log("error while adding product to user cart ")
  }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


exports.searchProducts = async (req, res) => {
  try {
    // Instead of req.query.q, you pull it from the body
    const searchTerm = req.body.searchTerm || ""

    if (!searchTerm.trim()) {
      return res.json({ products: [] })
    }

    // ATTEMPT 1: Fast Full-Text Search (Looks for whole words)
    let products = await productModel.find({
      $text: { $search: searchTerm }
    }).limit(20)

    // ATTEMPT 2: Fallback to Regex if full-text finds nothing
    // This catches partial words (e.g., typing "lap" finds "laptop" for the dropdown)
    if (products.length === 0) {
      const searchRegex = new RegExp(searchTerm, 'i')
      
      products = await productModel.find({
        $or: [
          { name: { $regex: searchRegex } },
          { sellerName: { $regex: searchRegex } },
          { category: { $regex: searchRegex } },
          { type: { $regex: searchRegex } },
          { tags: { $in: [searchRegex] } } 
        ]
      }).limit(20)
    }

    res.json({ products: products })

  } catch (err) {
    console.log("Error searching products:", err)
    res.status(500).json({ error: "Failed to search products" })
  }
}