const path = require('path')
const multer = require("multer")
const upload = multer({ dest: 'uploads/' })
const express =require ("express")
const router = express.Router()
const {
    getcategories,
    createCategory,
    getCategoryTypes,
    addType,
    updateType,
    createProduct,
    uploadProductImage,
    getTopSellingProducts,
    getMostViewedProducts,
    getOnSaleProducts,
    getProduct,
    submitReview,
    getReviews
}=require("../controllers/productController")

router.post("/Get_Categories",getcategories)




router.post("/Get_Category_Types", getCategoryTypes)

router.post("/Create_Category", createCategory)

router.post("/Add_Type", addType)

router.post("/Update_Type", updateType)

router.post("/Create_Product", createProduct)

router.post("/Upload_Product_Image",upload.single("image"), uploadProductImage)

router.post("/Get_Top_Selling_Products", getTopSellingProducts)

router.post("/Get_Most_Viewed_Products", getMostViewedProducts)

router.post("/Get_On_Sale_Products", getOnSaleProducts)

router.get("/:productName/:productId", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/Product_Page.html"))
})
router.get("/:productId", getProduct)


router.post("/Submit_Product_Review",submitReview)

router.post("/Get_Reviews",getReviews)


module.exports = router