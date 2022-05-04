const express=require("express");
const router=express.Router();
const isAthenticate=require("../middleware/isAthenticate")
const userController=require("../controllers/user")
// Get all Users:admin
router.get("/",isAthenticate,userController.getAllUsers)


// User statistics : admin
router.get("/stats",isAthenticate,userController.getUserStates)

// get watchlist
router.get("/watchList",isAthenticate,userController.getWatchList)

// Get Details of user:admin and user
router.get("/:userId",isAthenticate,userController.getUserDetails)

// Delete user:admin
router.delete("/:userId",isAthenticate,userController.deleteUser)

// Update user:admin and user
router.put("/:userId",isAthenticate,userController.updateUser)

// Add to watch list
router.post("/watchList/add/",isAthenticate,userController.addWatchList)

// remove from watch list
router.delete("/watchList/delete",isAthenticate,userController.removeWatchList)

module.exports=router