const fs=require("fs")
const userModel = require('../models/userModel.js')
const productModel = require('../models/productModel.js')
const{
  uploadProfileImage,
  deleteImage
}=require("../services/cloudinaryService")

exports.getProfileDetails=async (req, res) => {
  console.log(req.body)
  try{
  const profileImg=await getProfileImg(req.body)
  const profileUsername=await getProfileUsername(req.body)
  const profileEmail=await getProfileEmail(req.body)
  const profileVerification=await getProfileVerification(req.body)
  const sellerVerification=await getSellerVerification(req.body)
  const myCart=await getProfileCart(req.body)
  const myCartTotal = myCart.reduce((sum, currentItem) => {
  return sum + currentItem.quantity;
}, 0)
  res.json({ profileImg:profileImg,
    username:profileUsername,
    email:profileEmail,
    verification:profileVerification,
    sellerVerification:sellerVerification,
    myCartItemNo:myCartTotal
   })
  }catch(err){
    console.log("error while sending profileimg:",err)
  }
}



async function getProfileEmailDB(userObj){
  try{
      const profileEmail= await userModel.find({id:userObj.id}).select('-_id email')
      return profileEmail
      }catch(err){
        console.log("did not find profile email :",err)
      }
    
}

async function getProfileEmail(userObj){
  let profileEmail=await getProfileEmailDB(userObj)
  profileEmail=profileEmail[0].email
  return profileEmail
}

async function getProfileVerificationDB(userObj){
  try{
      const profileVerification= await userModel.find({id:userObj.id}).select('-_id verification')
      return profileVerification
      }catch(err){
        console.log("did not find profile email :",err)
      }
    
}

async function getProfileVerification(userObj){
  let profileVerification=await getProfileVerificationDB(userObj)
  profileVerification=profileVerification[0].verification
  return profileVerification
}

async function getSellerVerificationDB(userObj){
  try{
      const sellerVerification= await userModel.find({id:userObj.id}).select('-_id sellerVerification')
      return sellerVerification
      }catch(err){
        console.log("did not find profile email :",err)
      }
    
}

async function getSellerVerification(userObj){
  let sellerVerification=await getSellerVerificationDB(userObj)
  sellerVerification=sellerVerification[0].sellerVerification
  return sellerVerification
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


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


exports.setProfileImage=async (req, res) => {
  const id = req.body.id

  try {
    const response = await uploadProfileImage(req.file.path, id)
  
    await setProfileImg(id,response.secure_url,response.public_id)

    await fs.unlink(req.file.path, (err) => { 
      if (err) 
        console.error('Failed to delete temp file:', err
      ) 
    })

    res.json({ message: "Image uploaded successfully!"})
  } catch (err) {
    console.error(err)
    await fs.unlink(req.file.path, (unlinkErr) => { 
      if (unlinkErr) 
        console.error('Failed to delete temp file after error:', unlinkErr)
      })
    res.status(500).json({ error: "Upload failed" })
  }

}


exports.changeProfileImage=async (req, res) => {
  const id = req.body.id
   const idObj={id:id}
  console.log("ID received:", id)
  let profileImgPubId=await getProfileImgPubId(idObj)
  try { 
   const response = await deleteImage(profileImgPubId)
    console.log("Delete response:", response.data) 
  } catch (err) { 
    console.error("Error deleting image:", err) 
    res.status(500).json({ error: "Upload failed" })
    return
  }

  try {
    const response = await uploadProfileImage(req.file.path, id)
    
    await setProfileImg(id,response.secure_url,response.public_id)

    await fs.unlink(req.file.path, (err) => { 
      if (err) 
        console.error('Failed to delete temp file:', err
      ) 
    })

    res.json({ message: "Image uploaded successfully!"})
  } catch (err) {
    console.error(err)
    await fs.unlink(req.file.path, (unlinkErr) => { 
      if (unlinkErr) 
        console.error('Failed to delete temp file after error:', unlinkErr)
      })
    res.status(500).json({ error: "Upload failed" })
  }

}


exports.deleteProfileImage=async (req, res) => {
  const id = req.body.id
   const idObj={id:id}
  console.log("ID received:", id)
  const profileImgPubId=await getProfileImgPubId(idObj)
 
  try { 
    const response = await deleteImage(profileImgPubId)
    console.log("Delete response:", response.data) 
    await setProfileImg(id,null,null)
    res.json({ message: "Image deleted successfully!"})
  } catch (err) { 
    console.error("Error deleting image:", err) 
    res.status(500).json({ error: "Upload failed" })

  }

}


async function getProfileImgPubIdDB(userObj){
  try{ 
      const profileImgPubId= await userModel.find({id:userObj.id}).select('-_id profileImgPubId')
     return profileImgPubId
      }catch(err){
        console.log("did not find delete profile img :",err)
      }
}

async function getProfileImgPubId(userObj){
  let profileImgPubId=await getProfileImgPubIdDB(userObj)
  profileImgPubId=profileImgPubId[0].profileImgPubId
  
  return profileImgPubId
  
}

async function setProfileImg(id,profileImg,profileImgPubId){
  try{
  await userModel.updateOne({id:id},{$set:{profileImg:profileImg,profileImgPubId:profileImgPubId}})
  }catch(err){
    console.log("error while setting profile img:",err)
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.getMyCart=async (req,res)=>{
  const id = req.body.id
  const idObj={id:id}
  const myCart= await getProfileCart(idObj)
  const myCartTotal = myCart.reduce((sum, currentItem) => {
  return sum + currentItem.quantity;
  }, 0)
  const productIds = myCart.map(item => item.productId)
  let productsObj=[]
  for(i=0;i<productIds.length;i++){
    try{
      let productDetails = await productModel.find( { productId: { $in: productIds[i] } }, { name: 1, category: 1,type: 1, productImg1: 1, currency: 1, price: 1, discount: 1, sellerName:1 ,ratings: 1,noCustomersReviewed:1,_id: 0 } )
      productDetails=productDetails[0] 
      productsObj.push(productDetails)
      

    }catch(err){
      console.log("failed to fetch product details:",err)
    }
  }
  res.json({
    products:productsObj,
    myCart:myCart
   })

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


exports.incrementQuantity=async (req,res)=>{
  const userId=req.body.userId
  const productId=req.body.productId
  try{
    const result = await userModel.updateOne(
  { id: userId, "myCart.productId": productId },
  { $inc: { "myCart.$.quantity": 1 } }
  )
    res.json({ message:"Product quantity increased sucessfully"})
  }catch(err){
    console.log("error while adding product to user cart ")
     res.status(500).json({ message: "Failed to increment product" }) 
  }
}


exports.decrementQuantity = async (req, res) => {
  const userId = req.body.userId
  const productId = req.body.productId

  try {
    await userModel.updateOne(
      { id: userId, "myCart.productId": productId },
      { $inc: { "myCart.$.quantity": -1 } }
    )

    await userModel.updateOne(
      { id: userId },
      { $pull: { myCart: { productId: productId, quantity: { $lte: 0 } } } }
    )

    res.json({ message: "Product quantity decremented successfully" })
  } catch (err) {
    console.error("Error while decrementing product in user cart: ", err)
    res.status(500).json({ message: "Failed to decrement product" }) 
  }
}

exports.removeProduct = async (req, res) => {
  const userId = req.body.userId
  const productId = req.body.productId

  try {
    await userModel.updateOne(
      { id: userId },
      { $pull: { myCart: { productId: productId } } }
    );

    res.json({ message: "Product successfully removed from cart" })
  } catch (err) {
    console.error("Error while removing product from user cart: ", err)
    res.status(500).json({ message: "Failed to remove product" })
  }
}