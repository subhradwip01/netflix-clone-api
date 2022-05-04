const express=require("express");
const router=express.Router();
const isAthenticate=require("../middleware/isAthenticate")
const movieController=require("../controllers/movie")
// Post new movie
router.post("/add",isAthenticate,movieController.postNewMovie)
// Post Update of movie
router.put("/:movieId",isAthenticate,movieController.postUpdateMovie)
// Get detils of a movie
router.get("/find/:movieId",isAthenticate,movieController.getMovieDetails)
// Delete movie
router.delete("/:movieId",isAthenticate,movieController.postDeleteMovie)
// get all movies
router.get("/",isAthenticate,movieController.getMovies)
router.get("/random",isAthenticate,movieController.getRandomMovie)

module.exports=router