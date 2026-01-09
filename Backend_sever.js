
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

