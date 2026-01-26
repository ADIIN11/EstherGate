const userModel = require('../models/userModel')








exports.userCreation=async (req, res) => {
  const userData = req.body; // axios sends JSON here
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

