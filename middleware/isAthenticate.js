const jwt=require("jsonwebtoken")

const isAthenticate=async (req,res,next)=>{
    // Get the auth token
    const authToken=req.get("Authorization");
    if(!authToken){
        res.status(401).json({
            message:"Authentication tokn not available"
        })
    } 

    const token=authToken.split(" ")[1];
    jwt.verify(token,process.env.PRIVATE_KEY,(err,userInfo)=>{
        if(err){
            res.status(401).json({
                message:"Not a valid Auth token"
            })
        }else{
            req.userInfo=userInfo
            next()
        }
    })
}

module.exports=isAthenticate
    