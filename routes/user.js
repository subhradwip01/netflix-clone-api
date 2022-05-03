const express=require("express");
const router=express.Router();
const isAthenticate=require("../middleware/isAthenticate")
const userController=require("../controllers/user")
// Get all Users:admin
router.get("/",isAthenticate,userController.getAllUsers)


// Get Details of user:admin and user
router.get("/:userId",isAthenticate,userController.getUserDetails)

// User statistics : admin
router.get("/stats",isAthenticate,userController.getUserStates)

// Delete user:admin
router.delete("/:userId",isAthenticate,userController.deleteUser)

// Update user:admin and user
router.put("/:userId",isAthenticate,userController.updateUser)

module.exports=router