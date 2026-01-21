const express = require("express");
const path = require("path");

const app = express();

const {products} = require("./data")

const PORT = 5000;


app.use(express.static(path.join(__dirname, "public")));


app.get("/Store", (req, res) => {
  res.sendFile(path.join(__dirname, "Store.html"));
});


app.get("/Sign_In", (req, res) => {
  res.sendFile(path.join(__dirname, "Sign_In.html"));
});


app.get("/Sign_Up", (req, res) => {
  res.sendFile(path.join(__dirname, "Sign_Up.html"));
});


app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

app.listen(PORT, () => {
  console.log("welcome to Esther Gate")
  console.log(`Listening on port ${PORT}`);
});



















const bcrypt = require('bcrypt')


















let userInfo=[]



console.log("server is running")





else 
        {  
        let userData = {
            username: nameInpt.value,
            email: emailInpt.value,
            password: passwordInpt.value,
            createdAt: now.toDateString(),
            verfication:0, 
            myOrders:null,
            sellerVerification:0,
            productListed:null,
            

            };
            console.log(userData)
        if(checkUser(userData)){                              // call to check user already exist in db
            msgPara.textContent="Account already exists, Pls Sign-In"
            console.log("Account already exists")
        }
        else{
            createUser(userData)                             // call to create user in db
            msgPara.textContent="Account Created successfully"
            console.log("Account Created successfully")

        }

        

        form.reset()
        
        }











function checkUser(userObj){
    


    let uniqueUserNameEmail=[... new Set(userInfo.map((objName)=>objName.username)),... new Set(userInfo.map((objEamil)=>objEamil.email))]
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

    try { 
             // Await the hash const 
  
        hash = await bcrypt.hash(password, saltRounds) // Replace plain password with hashed one 
        userObj.password = hash
    }catch (err){ 
    console.error("Error hashing password:", err) 
    }



    userInfo.push(userObj)
    console.log(userInfo)
}

