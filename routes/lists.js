const express = require("express")
const router=express.Router();
const listController=require("../controllers/lists")
const isAthenticate=require("../middleware/isAthenticate")
// Post movie list
router.post("/add",isAthenticate,listController.postList)
// Get movie list
router.get("/",isAthenticate,listController.getList)
// Delete movie list
router.delete("/:listId",isAthenticate,listController.deleteList)

// get list details
router.get("/find/:listId",isAthenticate,listController.getDetailsList)

// Upadate movie list
module.exports=router