const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')

const {
  tokenGenerator,
} = require('../services/tokenService')


exports.userSingUp=async (req, res) => {
  const userData = req.body // axios sends JSON here
  console.log(userData)
  const checkUser=await checkUserSignUp(userData)
  if (checkUser) {
    if(checkUser===1)
      res.json({ exists: 1 })
    else if(checkUser===2)
      res.json({ exists: 2 })
  } else {          
     createUser(userData)  
    res.json({ exists: false })
  }
}



async function checkUserSignUp(userObj){

    // let uniqueUserNameEmail=[... new Set(userList.map((objName)=>objName.username)),... new Set(userList.map((objEamil)=>objEamil.email))]

    const uniqueUserNameEmailObjArr= await userModel.find().select('-_id username email')
    const uniqueUserNameEmail=[... new Set(uniqueUserNameEmailObjArr.map((objName)=>objName.username)),... new Set(uniqueUserNameEmailObjArr.map((objEamil)=>objEamil.email))]
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
    userObj[id]=await userModel.countDocuments()
    console.log(userObj)
    const newUser= new userModel(userObj)
    await newUser.save().then(()=>console.log("New Account Saved")).catch(err=>console.log("Saving Error",err))
}






//////////////////////////////////////////////////////////////////////////////////////////////////





exports.userSingIn=async(req, res) => {
  const userData = req.body 
  console.log(userData)
  const checkUserEmail=await checkUserSignIn(userData)
  if (!checkUserEmail) {
    res.json({ exists: false })
  } else {          // create user logic here
     if(checkPassword(userData)){
     
      const token=await tokenGenerator(userData)
      console.log(token)
      
      res.json({ exists: true,passwordCorrect:true,token:token })}
      else
        res.json({ exists: true,passwordCorrect:false })
  }
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


