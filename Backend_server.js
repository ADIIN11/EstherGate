const express = require("express")
const path = require("path")
const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')
require('dotenv').config({ quiet: true });



const {productsList,userList} = require("./data");
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
  if (checkUserSignUp(userData)) {
    res.json({ exists: true })
  } else {          
     createUser(userData)  
    res.json({ exists: false })
  }
})






app.get("/Sign_In", (req, res) => {
  res.sendFile(path.join(__dirname, "Sign_In.html"))
})

app.post("/Sign_In", (req, res) => {
  const userData = req.body; // axios sends JSON here
  console.log(userData)
  if (!checkUserSignIn(userData)) {
    res.json({ exists: false })
  } else {          // create user logic here
     if(checkPassword(userData)){
      //  tokenGenerator(userData)
      res.json({ exists: true,passwordCorrect:true })}
      else
        res.json({ exists: true,passwordCorrect:false })
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
    if(uniqueUserNameEmail[i]===userObj.username||uniqueUserNameEmail[i]===userObj.email)
        return true
   
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
    userList.push(userObj)
   
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
      console.log(isMatch)
      return isMatch
    }catch (err){ 
    console.error("Error password matching:", err) 
    return false;
    }

}

async function tokenGenerator(userObj){
  
  const payload=()=>{
   for(let i=0;i<userList.length;i++)
        if(userList.username[i]===userObj.usernameEmail||userList.email[i]===userObj.usernameEmail)
          return {id:userList.id[i],
                  role:userList.role[i]}
    
  }
  const secretKey=process.env.secretKey
  const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); 
  console.log(token);
}