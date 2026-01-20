// const http=require("http")
// const fs=require("fs")
// const path=require("path")

// const server=http.createServer((req,res)=>{
//     if(req.url==='/'){
//         const filePath= path.join(__dirname,"store.html")

//         fs.readFile(filePath,(err,data)=>{
//             if(err){
//                 res.writeHead(500,{"content-type":"text/plain"})
//                 res.end("Internal Error")
//             }
//             else{
//                 res.writeHead(200,{"content-type":"text/html"})
//                 res.end(data)
//             }
//         })
//     }
//     else if(req.url==='/Sign_Up'){
//         const filePath= path.join(__dirname,"Sign_Up.html")
//           fs.readFile(filePath,(err,data)=>{
//             if(err){
//                 res.writeHead(500,{"content-type":"text/plain"})
//                 res.end("Internal Error")
//             }
//             else{
//                 res.writeHead(200,{"content-type":"text/html"})
//                 res.end(data)
//             }
//         })

//     }
//     else{
//         res.writeHead(404, { 'Content-Type': 'text/plain' })
//         res.end('Page Not Found')
//     }
// })
// server.listen(5000,()=>{
//     console.log("listening to port 5000")
// })



//access server by http://localhost:5000




const express = require("express");
const path = require("path");

const app = express();
const PORT = 5000;


app.use(express.static(path.join(__dirname, "public")));


app.get("/Store", (req, res) => {
  res.sendFile(path.join(__dirname, "Store.html"));
});


app.get("/Sign_Up", (req, res) => {
  res.sendFile(path.join(__dirname, "Sign_Up.html"));
});


app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});









const bcrypt = require('bcrypt')


















let userInfo=[]



console.log("server is running")

















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

