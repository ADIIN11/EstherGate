const userModel = require('../models/userModel')
const axios = require("axios")

const FormData = require("form-data")


exports.getProfileDetails=async (req, res) => {
  console.log(req.body)
  try{
  const profileImg=await getProfileImg(req.body)
  const profileUsername=await getProfileUsername(req.body)
  const profileEmail=await getProfileEmail(req.body)
  const profileVerification=await getProfileVerification(req.body)
  const sellerVerification=await getSellerVerification(req.body)
  res.json({ profileImg:profileImg,
    username:profileUsername,
    email:profileEmail,
    verification:profileVerification,
    sellerVerification:sellerVerification
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


exports.setProfileImage=async (req, res) => {
  const id = req.body.id

  const imgbbKey=process.env.IMG_BB_KEY
  let profileImg
  let deleteProfileImg

  try {
    const formData = new FormData()
    formData.append("image", req.file.buffer.toString("base64"))
    formData.append("name", `Id:${id}-profileImg`)

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
      formData,
      { headers: formData.getHeaders() }
    )
    profileImg=response.data.data.url
    deleteProfileImg=response.data.data.delete_url
    await setProfileImg(id,profileImg,deleteProfileImg)

    res.json({ message: "Image uploaded successfully!"})
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Upload failed" })
  }

}


exports.changeProfileImage=async (req, res) => {
  const id = req.body.id
   const idObj={id:id}
  console.log("ID received:", id)
  let deleteProfileImg=await getDeleteProfileImg(idObj)
  const imgbbKey=process.env.IMG_BB_KEY
  const urlObj = new URL(deleteProfileImg)   
 const pathname = urlObj.pathname
 const parts = pathname.split("/")
 const imageId = parts[1] 
 const imageHash = parts[2]

    const payload = new URLSearchParams()
    payload.append("pathname", `/${imageId}/${imageHash}`)
    payload.append("action", "delete")
    payload.append("delete", "image")
    payload.append("from", "resource")
    payload.append("deleting[id]", imageId)
    payload.append("deleting[hash]", imageHash)

   console.log(payload)

  try { 
   const response = await axios.post("https://ibb.co/json", payload, { headers: { "Content-Type": "application/x-www-form-urlencoded" } })
    console.log("Delete response:", response.data) 
  } catch (err) { 
    console.error("Error deleting image:", err) 
    res.status(500).json({ error: "Upload failed" })
    return
  }

  let profileImg
  
  try {
    const formData = new FormData()
    formData.append("image", req.file.buffer.toString("base64"))
    formData.append("name", `Id:${id}-profileImg`)

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
      formData,
      { headers: formData.getHeaders() }
    )
    console.log(response.data)
    profileImg=response.data.data.url
    deleteProfileImg=response.data.data.delete_url
    await setProfileImg(id,profileImg,deleteProfileImg)

    res.json({ message: "Image uploaded successfully!"})
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Upload failed" })
  }

}


exports.deleteProfileImage=async (req, res) => {
  const id = req.body.id
   const idObj={id:id}
  console.log("ID received:", id)
  let deleteProfileImg=await getDeleteProfileImg(idObj)
  const urlObj = new URL(deleteProfileImg)   
 const pathname = urlObj.pathname
 const parts = pathname.split("/")
 const imageId = parts[1] 
 const imageHash = parts[2]

    const payload = new URLSearchParams()
    payload.append("pathname", `/${imageId}/${imageHash}`)
    payload.append("action", "delete")
    payload.append("delete", "image")
    payload.append("from", "resource")
    payload.append("deleting[id]", imageId)
    payload.append("deleting[hash]", imageHash)

   console.log(payload)

  try { 
   const response = await axios.post("https://ibb.co/json", payload, { headers: { "Content-Type": "application/x-www-form-urlencoded" } })
    console.log("Delete response:", response.data) 
    await setProfileImg(id,null,null)
    res.json({ message: "Image deleted successfully!"})
  } catch (err) { 
    console.error("Error deleting image:", err) 
    res.status(500).json({ error: "Upload failed" })

  }

}


async function getDeleteProfileImgDB(userObj){
  try{
      const deleteProfileImg= await userModel.find({id:userObj.id}).select('-_id deleteProfileImg')
      return deleteProfileImg
      }catch(err){
        console.log("did not find profile email :",err)
      }
    
}

async function getDeleteProfileImg(userObj){
  let deleteProfileImg=await getDeleteProfileImgDB(userObj)
  deleteProfileImg=deleteProfileImg[0].deleteProfileImg
  return deleteProfileImg
}

async function setProfileImg(id,profileImg,deleteProfileImg){
  try{
  await userModel.updateOne({id:id},{$set:{profileImg:profileImg,deleteProfileImg:deleteProfileImg}})
  }catch(err){
    console.log("error while setting profile img:",err)
  }
}