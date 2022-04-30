const User=require("../models/User")
const bcrypt=require("bcryptjs");
const { json } = require("body-parser");
const { find } = require("../models/User");

exports.updateUser= async (req,res,next)=>{
    // Only logged in user can update user and admin
    const userId=req.params.userId;
    if(userId===req.userInfo.id || req.userInfo.isAdmin){
      // Getting all inputs from req.body
      const username=req.body.username;
      const email=req.body.email;
      const password=req.body.password;
      const profilePic=req.body.profilePic;
      
      const existUser=await User.findById({_id:userId});
      if(!existUser){
          res.status(404).json({
              message:"User doesn't exist"
          })
      }

    //   if the new username and email is already available then cannot update username and email
      if(username!==existUser.username || email!==existUser.email){
          const message={}
        //   If username changed
          const userWithSameUserName=username!==existUser.username && await User.findOne({username})
          if(userWithSameUserName?._doc){
            message.username="Username exist"
          }
        //   if email chnaged
          const userWithSameUserEmail=email!==existUser.email && await User.findOne({email})
          if(userWithSameUserEmail?._doc){
              message.email="Email exist"
          }
          
          if(userWithSameUserEmail?._doc || userWithSameUserName?._doc){
          res.status(403).json({
              message:message
          })
          return
        }
      }  

    //New password hasing
    try {
       const hashedPass = await bcrypt.hash(password, process.env.SALT);
       existUser.username=username;
       existUser.email=email;
       existUser.password=hashedPass;
       existUser.profilePic=profilePic;
       const updatedUser=await existUser.save()
       return res.status(201).json({
           message:"Updatation successfull",
           userInfo:updatedUser
       })
    } catch (e) {
        return res.status(500).json({
            message:e.message
        })
    }

    }else{
        res.status(403).json("You can only update your account or admin can")
    }
}

exports.deleteUser= async (req,res,next)=>{
    const userId=req.params.userId;
    if(userId===req.userInfo.id || req.userInfo.isAdmin){
        try{
        await User.findByIdAndDelete({_id:userId})
        res.status(200).json({
            message:"Dleted successfully"
        })
        }catch(e){
            res.status(403).json({
                message:e.message
            })
        }
    }else{
        res.status(403).json({
            message:"Only user or admin can delete"
        }) 
    }
}

exports.getUserDetails= async (req,res,next)=>{
    const userId=req.params.userId;
    const isEdit=req.query.isEdit;
    if(userId===req.userInfo.id || req.userInfo.isAdmin){
        try{
        const userDetails=await User.findById({_id:userId})
        
        if(isEdit){
          info=userDetails._doc
        }else{
            const {password,...user}=userDetails._doc
            info=user
        }
        
        res.status(200).json({
            userInfo:info
        })
        }catch(e){
            res.status(403).json({
                message:e.message
            })
        }
    }else{
        res.status(403).json({
            message:"Only user or admin can see the deayils of a user"
        }) 
    }
}


exports.getAllUsers = async (req,res,next)=>{
    let latest=req.query.latest
    console.log(req.userInfo)
    if(req.userInfo.isAdmin){
        try{
        const allUsers=latest ? await User.find().sort({_id:-1}).limit(10) : await User.find()
        res.status(200).json({
            users:allUsers
        })
    }catch(e){
        res.status(403).json({
            message:"Unable to fetch users"
        }) 
    }
    }else{
        res.status(403).json({
            message:"Only admin can see all users"
        }) 
    }
}