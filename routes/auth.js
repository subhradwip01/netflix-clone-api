const express=require("express");
const router=express.Router();
const authController=require("../controllers/auth")
// Signup
router.post("/signup",authController.postSignup)

// Login
router.post("/login",authController.postLogin)

module.exports=router;