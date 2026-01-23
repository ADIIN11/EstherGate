const express = require("express")
const path = require("path")
const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')
require('dotenv').config({ quiet: true });



const {productsList,userList} = require("./data");

const mongoose= require("mongoose");
const { exit } = require("process");

mongoose.connect(process.env.MONGO_DB_URL).then(()=>console.log("MongoDB Connected Successfully :)")).catch(err=>{console.log("MongoDB Connection Error :",err)
})

const userSchema=new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    createdAt: String,
    verification: Boolean,
    myCart: Array,
    myOrders: Array,
    address: Object,
    sellerVerification: Boolean,
    productListed:Array,
    role: String
  },{ versionKey: false })
  const userModel = mongoose.model("User",userSchema,"users")























const app = express();

app.use(express.json())


const PORT = process.env.PORT


app.use(express.static(path.join(__dirname, "public")))


app.get("/Store", (req, res) => {
  res.sendFile(path.join(__dirname, "Store.html"))
})

app.get("/Sign_Up", (req, res) => {
  res.sendFile(path.join(__dirname, "Sign_Up.html"))
})


app.post("/Sign_Up", (req, res) => {
  const userData = req.body; // axios sends JSON here
  console.log(userData)
  const checkUser=checkUserSignUp(userData)
  if (checkUser) {
    if(checkUser===1)
      res.json({ exists: 1 })
    else if(checkUser===2)
      res.json({ exists: 2 })
  } else {          
     createUser(userData)  
    res.json({ exists: false })
  }
})






app.get("/Sign_In", (req, res) => {
  res.sendFile(path.join(__dirname, "Sign_In.html"))
})

app.post("/Sign_In", async(req, res) => {
  const userData = req.body 
  console.log(userData)
  if (!checkUserSignIn(userData)) {
    res.json({ exists: false })
  } else {          // create user logic here
     if(checkPassword(userData)){
     
      const token=await tokenGenerator(userData)
      console.log(token)
      
      res.json({ exists: true,passwordCorrect:true,token:token })}
      else
        res.json({ exists: true,passwordCorrect:false })
  }
})


app.post("/Token_Verification", async (req, res) => {
  const token=req.body
  console.log(token)
  const userData=await verifyToken(token)
  if(userData){
    const username=userData.username
    const role=userData.role
    const id=userData.id

    res.json({ tokenVerified:true,
      username:username,
      role:role,
      id:id
    })}
  else{
    res.json({ tokenVerified:false })
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



function checkUserSignUp(userObj){

    let uniqueUserNameEmail=[... new Set(userList.map((objName)=>objName.username)),... new Set(userList.map((objEamil)=>objEamil.email))]
    console.log(uniqueUserNameEmail)

   for(let i=0;i<uniqueUserNameEmail.length;i++)
   {
    if(uniqueUserNameEmail[i]===userObj.username)
        return 1
    if(uniqueUserNameEmail[i]===userObj.email)
      return 2
   
   }
    return false
}




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
    userObj[id]=userList.length
    console.log(userObj)
    const newUser= new userModel(userObj)
    await newUser.save().then(()=>console.log("New Account Saved")).catch(err=>console.log("Saving Error",err))
}



function checkUserSignIn(userObj){

    let uniqueUserNameEmail=[... new Set(userList.map((objName)=>objName.username)),... new Set(userList.map((objEamil)=>objEamil.email))]
   

   for(let i=0;i<uniqueUserNameEmail.length;i++)
   {
    if(uniqueUserNameEmail[i]===userObj.usernameEmail)
        return true
   
   }
    return false
}


async function checkPassword(userObj){

    function getPassword(){
      for(let i=0;i<userList.length;i++)
        if(userList[i].username===userObj.usernameEmail||userList[i].email===userObj.usernameEmail)
          return userList[i].password
      
    }
    const accountPassword=getPassword()
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
  
  function getUserData(){
   for(let i=0;i<userList.length;i++)
        if(userList[i].username===userObj.usernameEmail||userList[i].email===userObj.usernameEmail)
          return {id:userList[i].id,
                  username:userList[i].username,
                  role:userList[i].role}
    
  }
  const payload=getUserData()
  const secretKey=process.env.JWT_SECRET
  if (!secretKey) {
     throw new Error("JWT_SECRET is not defined in .env")
    }
  const token =  jwt.sign(payload, secretKey, { expiresIn: '2h' })
  return token
}





async function verifyToken(tokenObj){
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