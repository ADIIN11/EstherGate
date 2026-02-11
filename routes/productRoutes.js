const express =require ("express")
const router = express.Router()
const {
    getcategories
}=require("../controllers/productController")

router.post("/Get_Categories",getcategories)




router.post("/Get_Category_Types", async(req,res)=>{
    const categoryObj=req.body
    console.log(categoryObj)
})





module.exports = router