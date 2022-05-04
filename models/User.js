const mongoose = require("mongoose")
const Schema=mongoose.Schema;

// Creating user schema
const User=new Schema({
    username:{
        type: String,
        required: true,
        unique:true
    },
    email:{
        type: String,
        required: true,
        unique:true
    },
    password:{
        type: String,
        required: true
    },
    profilePic:{
        type:String,
        default:""
    },
    isAdmin:{
      type:Boolean,
      default:false,
    },
    watchList:[
        {
            type:Schema.Types.ObjectId,
            ref:"Movie"
        }
    ]

},{
    timestamps: true
})



module.exports = mongoose.model("User",User)