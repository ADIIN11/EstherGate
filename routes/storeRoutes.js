const path = require('path')
const express =require ("express")
const router = express.Router()
const {
  getTopSellingProducts,
  getMostViewedProducts
   
}=require("../controllers/storeController")
module.exports = router

router.get("/:page", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/Store_Page.html"))
})

router.post("/Get_Top_Selling_Products", getTopSellingProducts)

router.post("/Get_Most_Viewed_Products", getMostViewedProducts)