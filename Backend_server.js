const express = require("express")
const path = require("path")
const bcrypt = require('bcrypt')
const app = express();


const {productsList,userList} = require("./data");


app.use(express.json())


const PORT = 5000;


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
  if (checkUser(userData)) {
    res.json({ exists: true })
  } else {          // create user logic here
     createUser(userData)  // example: add to array
    res.json({ exists: false })
  }
})






app.get("/Sign_In", (req, res) => {
  res.sendFile(path.join(__dirname, "Sign_In.html"))
})



app.use((req, res) => {
  res.status(404).send("Page Not Found")
})

app.listen(PORT, () => {
  console.log("server is running")
  console.log("welcome to Esther Gate")
  console.log(`Listening on port ${PORT}`)
})



function checkUser(userObj){

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

