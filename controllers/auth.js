const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken")

exports.postSignup = async ( req, res, next) => {
  // extract user data from the req.body and validation check
  const { username, email, password, profilePic } = req.body;
  if (!username || !email || !password) {
    return res.status(422).json({
      message: "Please provide valid info",
    });
  }
  // Password hashing
  const hashedPass = await bcrypt.hash(password, process.env.SALT);

  // Creating User object
  const user = new User({
    username,
    email,
    password: hashedPass,
    profilePic,
  });
  try {
    // Check if the user is already exist
    const userNameExist = await User.find({
      $or: [{ username }, { email }]
    });
    if(userNameExist.length>0){
    if (userNameExist[0].username == username) {
      const err = new Error("User already exist");
      console.log(err.message)
      err.statusCode=422;
      throw err;
    }else if(userNameExist[0].email== email){
      const err = new Error("Email already exist");
      err.statusCode=422;
      throw err; 
    }
}
    const result= await user.save()
    if(!result){
        const e=new Error("Unable to Create user! Sorry for the inconvenice")
        
        e.statusCode=422;
        throw e;
    }

    res.status(201).json({
        message:"User created",
        userDetails:result
    })

  } catch (e) {
      const statusCode=e.statusCode || 500
      res.status(statusCode).json({
          message:e.message
      })
  }
};

exports.postLogin=async(req,res,next)=>{
    // Extracting user info and validating
    const { username,password }=req.body;
    if(!username || !password){
        res.status(401).json({
            message:"Please provide valid username and password"
        })
    }
    try{
    // Check for user exist or not 
    const userExist=await User.findOne({username})
    if(!userExist){
        const err=new Error("User is not exist")
        err.statusCode=404;
        throw err;
    }
    // checking password is is matching or not
    const checkedPass=await bcrypt.compare(password,userExist.password)
    if(!checkedPass){
        const err=new Error("Password is not matched")
        err.statusCode=403;
        throw err;
    }

    // Creating jwt token for auth
    const token= await jwt.sign({id:userExist._id,isAdmin:userExist.isAdmin},process.env.PRIVATE_KEY,{expiresIn:'1d'})
    const {password:pass,...info}=userExist._doc
    res.status(200).json({
        message:"Login Successfull",
        userInfo:{...info,token}

    })
   }catch(e){
        const statusCode=e.statusCode || 500;
        let message
        if(statusCode===500){
            message="Server side problem! Please try Agian later"
        }
        else{
            message=e.message
        }
        res.status(statusCode).json({
            message:message
        })
   }
}