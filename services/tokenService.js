const jwt = require('jsonwebtoken')

const userModel = require('../models/userModel')



exports.tokenGenerator=async function (userObj){
  
  // function getUserData(){
  //  for(let i=0;i<userList.length;i++)
  //       if(userList[i].username===userObj.usernameEmail||userList[i].email===userObj.usernameEmail)
  //         return {id:userList[i].id,
  //                 username:userList[i].username,
  //                 role:userList[i].role}
  // }


async function getUserDataDB(){
      try{
      const password=await userModel.find({username:userObj.usernameEmail}).select('-_id username role id')
      if (  !password || password.length === 0){
        console.log("did not find username ")
      }
      else{
        return password
    }
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


exports.verifyTokenSignIn=async function verifyTokenSignIn(tokenObj){
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





const revokedTokens = new Map()

// puts token in revoked list 
exports.revokeToken=function (token) { 
  revokedTokens.set(token, Date.now()) 
   console.log(`Token: ${token} is in the revoked list`) 
}

// checks if token is revoked 
exports.isTokenRevoked =function (token) {
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

