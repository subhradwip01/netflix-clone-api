const User=require("../models/User")
const bcrypt=require("bcryptjs");
const Movie=require("../models/Movie");

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

exports.getUserStates=async (req,res,next)=>{

    if(req.userInfo.isAdmin){
        const date=new Date();
    const lastYear=date.setFullYear(date.setFullYear()-1);
    const months=[
        "Januray",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ]

    try{
        const data=await User.aggregate([
            {
                $project:{
                    month:{$month:"$createdAt"}
                }
            },{
                $group:{
                    _id:"$month",
                    total: {$sum:1}
                }
            }
        ])
        res.status(200).json(data)
    }catch(err){
        res.status(500).json(err)
    }
    }else{
        res.status(403).json({
            message:"Only admin can see stats"
        })
    }
    
}

exports.addWatchList= async (req,res,next)=>{
    const movieId=req.query.movieId
    if(req.userInfo.isAdmin ||  req.userInfo.userId){
        try{
        const user=await User.findById(req.userInfo.userId);
        const watchList=user.watchList;
        const updatedWatchList=[...watchList];
        for(let i=0;i<updatedWatchList.length;i++){
            if(updatedWatchList[0]._id.toString()===movieId.toString()){
                res.status(403).json({
                    message:"You have already added this movie"
                })
                return
            }
        }
        const movie=await Movie.findById(movieId);
        updatedWatchList.push(movie)
        user.watchList=updatedWatchList;
        const updatedUser=await user.save()
        res.status(200).json({
            message:"Successfully added",
            updatedUser
        })
    }catch(e){
        res.status(500).json({
            message:e.message
        })
    }
    }else{
        res.status(403).json({
            message:"You are not allowed"
        })
    }
}
exports.removeWatchList= async (req,res,next)=>{
    const movieId=req.query.movieId
    if(req.userInfo.isAdmin ||  req.userInfo.userId){
        try{
        const user=await User.findById(req.userInfo.userId);
        const watchList=user.watchList;
        const updatedWatchList=[...watchList];
        const newWatchList=updatedWatchList.filter(item=>item._id.toString()!==movieId.toString())
        user.watchList=newWatchList;
        const updatedUser=await user.save()
        res.status(200).json({
            message:"Successfully added",
            updatedUser
        })
    }catch(e){
        res.status(500).json({
            message:e.message
        })
    }
    }else{
        res.status(403).json({
            message:"You are not allowed"
        })
    }
}

exports.getWatchList= async(req,res,next)=>{
    const type=req.query.type;
    if(req.userInfo.id){
        try{
        const user=await User.findById(req.userInfo.id)
        let watchList=[]
        if(type==="series"){
            for(let i=0;i<user.watchList.length;i++){
                if(user.watchList[i].type==="series"){
                    watchList.push(user.watchList[i])
                }
            }
        }else if(type==="movie"){
            for(let i=0;i<user.watchList.length;i++){
                if(user.watchList[i].type==="series"){
                    watchList.push(user.watchList[i])
                }
            }
        }else{
            for(let i=0;i<user.watchList.length;i++){
               watchList.push(user.watchList[i])
            }
        }
        res.status(200).json({
            watchList
        })
    }catch(e){
        res.status(500).json({
            message:e.message
        })
    }
    }else{
        res.status(403).json({
            message:"You ae not allwoed to see"
        })
    }
}