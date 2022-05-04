const e = require("express");
const List=require("../models/List")

exports.postList= async (req,res,next)=>{
    if(req.userInfo.isAdmin){
        const createdList=new List(req.body);
        try{
            const list=await createdList.save();
            res.status(200).json({
                list
            })
        }catch(e){
            res.status(500).json({
                message:e.message
            })
        }
    }else{
        res.status(403).json({
            message:"You are not allwoed see a movie list"
        })
    }
}

exports.deleteList=async(req,res,next)=>{
    if(req.userInfo.isAdmin){
        try{
            await List.findByIdAndDelete(req.userInfo.isAdmin);
            res.status(200).json({
                message:"List delted successfully"
            })
        }catch(e){
            res.status(500).json({
                message:e.message
            })
        }
    }else{
        res.status(403).json({
            message:"Only admin is allowed to delete a particular movie list"
        })
    }
}

exports.getList=async (req,res,next)=>{
    if(req.userInfo.isAdmin || req.userInfo.id){
        const {type,genre}=req.qurey;
        let list=[]
        
        try{
            if(type){
              if(genre){
                  list= await List.aggregate([
                      {$sample:{size:10}},
                      {$match:{type:type,genre:genre}}
                  ])
              }else{
                list= await List.aggregate([
                    {$sample:{size:10}},
                    {$match:{type:type}}
                ])
              }  
            }else{
                list = await List.aggregate([{$sample:{size:10}}])
            }

            res.satus(200).json({
                list:list
            })
        }catch(e){
            res.status(500).json({
                message:e.message
            })
        }
    }else{
        res.status(403).json({
            message:"You are not allwoed see a movie list"
        }) 
    }
}

exports.getDetailsList=async(req,res,next)=>{
    if(req.userInfo.isAdmin){
        try {
            const listData=await List.findById(req.params.listId)
        res.json(200).json({
            listData
        })
            
        } catch (e) {

            res.satus(500).json({
                message:e.message
            })
        }
        
    }else{
        res.satus(200).json({
            message:"Only admin can see"
        })
    }
}





