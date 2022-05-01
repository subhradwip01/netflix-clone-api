const express=require("express");
const router=express.Router();
const isAthenticate=require("../middleware/isAthenticate")
const userController=require("../controllers/user")
// Get all Users:admin
router.get("/users",isAthenticate,userController.getAllUsers)


// Get Details of user:admin and user
router.get("/user/:userId",isAthenticate,userController.getUserDetails)

// User statistics : admin
router.get("/users/stats",isAthenticate,userController.getUserStates)

// Delete user:admin
router.delete("/user/:userId",isAthenticate,userController.deleteUser)

// Update user:admin and user
router.put("/user/:userId",isAthenticate,userController.updateUser)

module.exports=router