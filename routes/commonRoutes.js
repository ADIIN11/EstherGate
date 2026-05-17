const express =require ("express")
const router = express.Router()
const {
    tokenVerification,
    userSignOut,
    getProfileImage,
    addProductToCart,
    searchProducts
}=require("../controllers/commonController")

const path = require('path')

router.get("/",(req, res) => {
  res.sendFile(path.join(__dirname, "../public/Hero_Landing_Page.html"))
})

router.get("/Home",(req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"))
})


router.post("/Token_Verification", tokenVerification)

router.post("/Sign_Out",userSignOut )

router.post("/Get_Profile_Img",getProfileImage )

router.post("/Add_To_Cart",addProductToCart )

router.post('/Search', searchProducts)


module.exports = router