const express =require ("express")
const router = express.Router()
const {
    tokenVerification,
    userSignOut,
    getProfileImage
}=require("../controllers/commonController")


router.post("/Token_Verification", tokenVerification)

router.post("/Sign_Out",userSignOut )

router.post("/Get_Profile_Img",getProfileImage )



module.exports = router