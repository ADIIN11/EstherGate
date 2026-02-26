const userModel = require('../models/userModel.js')
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
  console.log(req.body)
  try{
  const profileImg=await getProfileImg(req.body)
  const ProfileUsername=await getProfileUsername(req.body)
  res.json({ profileImg:profileImg,
    username:ProfileUsername
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