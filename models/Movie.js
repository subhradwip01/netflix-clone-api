const moongose=require("mongoose")
const Movie= new moongose.Schema({
   title: {
        type: String,
        required: true,
        unique: true,
    },
    desc:{
        type: String
    },
    imgBanner:{
        type: String
    },
    imgTitle:{
        type: String
    },
    imgThumbnail:{
        type: String
    },
    trailer:{
        type: String
    },
    video:{
        type: String
    },
    year:{
        type: String
    },
    limit:{
        type: Number
    },
    genre:{
        type:String
    },
    isSeries:{
        type:Boolean,
        default:false
    }

},{
    timestamps: true
})

module.exports= moongose.model("Movie",Movie)