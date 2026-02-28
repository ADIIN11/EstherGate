const path = require('path')
const multer = require("multer")
const upload = multer({ dest: 'uploads/' })
const express =require ("express")
const router = express.Router()
const {
    getProfileDetails,
    setProfileImage,
    changeProfileImage,
    deleteProfileImage,
    getMyCart
}=require("../controllers/profileController")


router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/Profile.html"))
})

router.post("/Get_Profile_Details", getProfileDetails)

router.get("/Edit_Profile", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/Profile_Img_Upload.html"))
})




router.post("/Set_Profile_Image", upload.single("image"),setProfileImage )



router.post("/Change_Profile_Image", upload.single("image"),changeProfileImage )

router.post("/Delete_Profile_Image",deleteProfileImage )


router.get("/List_Product", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/List_Product.html"))
})

router.get("/Cart_Page", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/Cart_Page.html"))
})

router.post("/Cart_page/Get_My_Cart",getMyCart)


module.exports = router