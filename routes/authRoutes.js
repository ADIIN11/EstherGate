const express =require ("express")
const router = express.Router()
const {
  userCreation
} = require('../controllers/authController')

const path = require('path')


router.get("/Sign_Up", (req, res) => {
  res.sendFile(path.join(__dirname, "../Sign_Up.html"))
})


router.post("/Sign_Up",userCreation)




router.get("/Sign_In", (req, res) => {
  res.sendFile(path.join(__dirname, "Sign_In.html"))
})

router.post("/Sign_In", async(req, res) => {
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
})


module.exports = router