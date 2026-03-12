const path = require('path')
const express =require ("express")
const router = express.Router()
const {
   
}=require("../controllers/storeController")

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/Store_Page.html"))
})