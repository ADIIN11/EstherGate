const express = require("express")
const path = require("path")
const axios = require("axios")
const multer = require("multer")
const upload = multer()
const bcrypt = require('bcrypt')
const FormData = require("form-data")
const jwt = require('jsonwebtoken')
require('dotenv').config({ quiet: true });

const {productsList,userList} = require("./data");

const mongoose= require("mongoose");
const { exit } = require("process");

mongoose.connect(process.env.MONGO_DB_URL).then(()=>console.log("MongoDB Connected Successfully :)")).catch(err=>{console.log("MongoDB Connection Error :",err)
})








const authRoutes=require("./routes/authRoutes")

const app = express();

app.use(express.json())

const PORT = process.env.PORT


app.use("",authRoutes)

app.use(express.static(path.join(__dirname, "public")))


app.get("/Store", (req, res) => {
  res.sendFile(path.join(__dirname, "Store.html"))
})


app.post("/Token_Verification", async (req, res) => {
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
})

app.post("/Sign_Out", (req, res) => {
 
  const tokenObj = req.body
  const token=tokenObj.token
  revokeToken(token) 
  res.json({ message: "Token revoked" }) 
})





app.post("/Get_Profile_Img", async (req, res) => {
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
})


app.get("/Profile", (req, res) => {
  res.sendFile(path.join(__dirname, "Profile.html"))
})

app.post("/Profile/Get_Profile_Details", async (req, res) => {
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
})

app.get("/Profile/Profile_Img_Upload", (req, res) => {
  res.sendFile(path.join(__dirname, "Profile_Img_Upload.html"))
})



app.post("/Set_Profile_Image", upload.single("image"), async (req, res) => {
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

})

app.post("/Change_Profile_Image", upload.single("image"), async (req, res) => {
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

})













app.use((req, res) => {
  res.status(404).send("Page Not Found")
})

app.listen(PORT, () => {
  console.log("server is running")
  console.log("welcome to Esther Gate")
  console.log(`Listening on port ${PORT}`)
})



const revokedTokens = new Map()

// puts token in revoked list 
function revokeToken(token) { 
  revokedTokens.set(token, Date.now()) 
   console.log(`Token: ${token} is in the revoked list`) 
}

// checks if token is revoked 
function isTokenRevoked(token) {
   return revokedTokens.has(token) 
  }


// Cleans revokedTokens list every 10 mins 
setInterval(() => {
   const now = Date.now()
  for (const [token, time] of revokedTokens.entries()) {
     if (now - time > 2 * 60 * 60 * 1000) {
       revokedTokens.delete(token)
       console.log(`Token ${token} expired from revoked list`) 
      } 
  } 
}, 10 * 60 * 1000);













async function createUser(userObj){

    let password= userObj.password
    const saltRounds = 10

    try { // Await the hash const 
  
        hash = await bcrypt.hash(password, saltRounds) // Replace plain password with hashed one 
        userObj.password = hash
    }catch (err){ 
    console.error("Error hashing password:", err) 
    }

    let id="id"
    userObj[id]=await userModel.countDocuments()
    console.log(userObj)
    const newUser= new userModel(userObj)
    await newUser.save().then(()=>console.log("New Account Saved")).catch(err=>console.log("Saving Error",err))
}



async function checkUserSignIn(userObj){

    const uniqueUserNameEmailObjArr= await userModel.find().select('-_id username email')
    const uniqueUserNameEmail=[... new Set(uniqueUserNameEmailObjArr.map((objName)=>objName.username)),... new Set(uniqueUserNameEmailObjArr.map((objEamil)=>objEamil.email))]
    console.log(uniqueUserNameEmail)

   for(let i=0;i<uniqueUserNameEmail.length;i++)
   {
    if(uniqueUserNameEmail[i]===userObj.usernameEmail)
        return true
   
   }
    return false
}


async function checkPassword(userObj){

    // function getPassword(){
    //   for(let i=0;i<userList.length;i++)
    //     if(userList[i].username===userObj.usernameEmail||userList[i].email===userObj.usernameEmail)
    //       return userList[i].password
      
    // }

    async function getPasswordDB(){
      try{
      const password= userModel.find({username:userObj.usernameEmail}).select('-_id password')
      return password
      }catch(err){
        console.log("did not find username :",err)
      }
      try{
      const password= userModel.find({email:userObj.usernameEmail}).select('-_id password')
      return password
      }catch(err){
        console.log("did not find email :",err)
      }


    }
    const password= await getPasswordDB() 
    console.log(password)
    const accountPassword=password[0].password
    console.log(accountPassword)
    
    try {
    const isMatch = await bcrypt.compare(userObj.password, accountPassword)
      return isMatch
    }catch (err){ 
    console.error("Error password matching:", err) 
    return false;
    }

}




async function tokenGenerator(userObj){
  
  // function getUserData(){
  //  for(let i=0;i<userList.length;i++)
  //       if(userList[i].username===userObj.usernameEmail||userList[i].email===userObj.usernameEmail)
  //         return {id:userList[i].id,
  //                 username:userList[i].username,
  //                 role:userList[i].role}
    
  // }
async function getUserDataDB(){
      try{
      const password= userModel.find({username:userObj.usernameEmail}).select('-_id username role id')
      return password
      }catch(err){
        console.log("did not find username :",err)
      }
      try{
      const password= userModel.find({email:userObj.usernameEmail}).select('-_id username role id')
      return password
      }catch(err){
        console.log("did not find email :",err)
      }


    }

  const payloadArrObj=await getUserDataDB()
   console.log(payloadArrObj)
  const payload=payloadArrObj[0].toObject()
  console.log(payload)
  const secretKey=process.env.JWT_SECRET
  if (!secretKey) {
     throw new Error("JWT_SECRET is not defined in .env")
    }
  const token =  jwt.sign(payload, secretKey, { expiresIn: '1h' })
  return token
}





async function verifyTokenSignIn(tokenObj){
  console.log(tokenObj)
  const token=tokenObj.token

  try { const decoded = jwt.verify(token, process.env.JWT_SECRET) 
    console.log(decoded) 
    return decoded
  } catch (err) { 
    console.error("Invalid token:", err) 
    return false
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