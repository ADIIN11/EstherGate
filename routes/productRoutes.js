const express =require ("express")
const router = express.Router()
const {
    getcategories,
    createCategory,
    getCategoryTypes,
    addType,
    updateType
}=require("../controllers/productController")

router.post("/Get_Categories",getcategories)




router.post("/Get_Category_Types", getCategoryTypes)

router.post("/Create_Category", createCategory)

router.post("/Add_Type", addType)

router.post("/Update_Type", updateType)




module.exports = router