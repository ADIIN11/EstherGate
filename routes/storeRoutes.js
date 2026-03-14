const path = require('path')
const express =require ("express")
const router = express.Router()
const {
  getTopSellingProducts
   
}=require("../controllers/storeController")
module.exports = router

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/Store_Page.html"))
})