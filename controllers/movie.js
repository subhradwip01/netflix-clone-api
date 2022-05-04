const Movie=require("../models/Movie")

exports.postNewMovie=async(req,res,next)=>{
    console.log("movie")
    if(req.userInfo.isAdmin){
    
        if(!req.body.title){
            res.status(403).json({
                message:"Provide title of the movie"
            })
            try{
                const movie=new Movie(req.body)
                console.log("save")
                const savedMovie=await movie.save()
                res.status(200).json({
                    message:"Movie added successfully",
                    savedMovie
                })

            }catch(e){
                res.status(500).json({
                    message:e.message
                })
            }
        }
    }else{
        res.json(403).json({
            message:"Only admin can add movie"
        })
    }
}
exports.postUpdateMovie=async(req,res,next)=>{
    const movieId=req.params.movieId
    if(req.userInfo.isAdmin){
            try{

                const updatedMovie=await Movie.findByIdAndUpdate(movieId,{
                    $set:req.body
                },{new:true})
                res.status(200).json({
                    message:"Movie updated successfully",
                    updatedMovie
                })

            }catch(e){
                res.status(500).json({
                    message:e.message
                })
            }
    }else{
        res.json(403).json({
            message:"Only admin can update movie"
        })
    }
}

exports.postDeleteMovie=async(req,res,next)=>{
    const movieId=req.params.movieId
    if(req.userInfo.isAdmin){
            try{

                await Movie.findByIdAndDelete({_id:movieId})
                res.status(200).json({
                    message:"Movie delted successfully",
                })

            }catch(e){
                res.status(500).json({
                    message:e.message
                })
            }
    }else{
        res.json(403).json({
            message:"Only admin can delete movie"
        })
    }
}

exports.getMovieDetails=async(req,res,next)=>{
    const movieId=req.params.movieId
    if(req.userInfo.isAdmin || req.userInfo.id ){
            try{

                const movie=await Movie.findById({_id:movieId})
                res.status(200).json({
                    movie:movie._doc
                })  

            }catch(e){
                res.status(500).json({
                    message:e.message
                })
            }
    }else{
        res.json(403).json({
            message:"You are not athorized"
        })
    }
}

exports.getMovies=async(req,res,next)=>{
    const type=req.query.type;
    if(req.userInfo.isAdmin || req.userInfo.id){
            try{
                let allMovies
                if(type=="series"){
                    allMovies=await Movie.find({isSeries:true})
                }
                else{
                    allMovies=await Movie.find({isSeries:false}) 
                }
                res.status(200).json({
                    allMovies
                })  

            }catch(e){
                res.status(500).json({
                    message:e.message
                })
            }
    }else{
        res.json(403).json({
            message:"Only admin can get all movies"
        })
    }
}

exports.getRandomMovie=async(req,res,next)=>{
    const type=req.query.type;
    if(req.userInfo.isAdmin || req.userInfo.id){
            try{
                let allMovies
                if(type=="series"){
                    allMovies=await Movie.aggregate([
                        {$match:{isSeries:true}},
                        {$sample:{size:1}}
                    ])
                }
                else{
                    allMovies=await Movie.aggregate([
                        {$match:{isSeries:false}},
                        {$sample:{size:1}}
                    ])
                }
                res.status(200).json({
                    allMovies
                })  

            }catch(e){
                res.status(500).json({
                    message:e.message
                })
            }
    }else{
        res.json(403).json({
            message:"Only admin can get all movies"
        })
    }
}

