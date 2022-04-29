 const express = require("express")
 const mongoose=require("mongoose")
 const dotenv = require("dotenv")
 const bodyParser=require("body-parser")
 const authRouter=require("./routes/auth")



// Utils
//  Creating express instance
const app=express();
// Loading .env 
dotenv.config();
// Defing port number
const PORT=8080;



// middlewere
// body parser
app.use(bodyParser.json())
// auth
app.use(authRouter)

// admin

// users


// Initializing Server and connictin DB
app.listen(PORT,()=>{
    console.log(`Server started at ${PORT}`)
    mongoose.connect(process.env.MONGODB_URI,
        {useNewUrlParser: true}
      ).then(()=>{
        console.log("DB connected")
    }).catch(e=>console.log("Error in connection",e))
})