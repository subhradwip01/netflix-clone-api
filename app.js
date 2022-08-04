 const express = require("express")
 const mongoose=require("mongoose")
 const dotenv = require("dotenv")
 const bodyParser=require("body-parser")
 const authRouter=require("./routes/auth")
 const userRouter=require("./routes/user")
 const movieRouter=require("./routes/movie")
 const listsRouter=require("./routes/lists")


// Utils
//  Creating express instance
const app=express();
// Loading .env 
dotenv.config();
// Defing port number
const DEV_PORT=8080;



// middlewere
app.use(bodyParser.json())
app.use("/netflixApi/auth",authRouter)
app.use("/netflixApi/users",userRouter)
app.use("/netflixApi/movies",movieRouter)
app.use("/netflixApi/lists",listsRouter)

// Initializing Server and connictin DB
app.listen(process.env.PORT||DEV_PORT,()=>{
    console.log(`Server started at ${DEV_PORT}`)
    mongoose.connect(process.env.MONGODB_URI,
        {useNewUrlParser: true}
      ).then(()=>{
        console.log("DB connected")
    }).catch(e=>console.log("Error in connection",e))
})