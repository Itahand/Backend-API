import { Router } from "express"; 
export const pieceRoutes = Router();
import { Piece } from "../models/pieceModel";
import cors from 'cors';

const nodeHtmlToImage = require("node-html-to-image");
const font2base64 = require('node-font2base64')
const _data = font2base64.encodeToDataUrlSync(__dirname+'/../font/OpenSans-Regular.ttf')

pieceRoutes.post("/listingPiece", cors(), async (req, res)=>{

    let { id} = req.body

    try {
        let pieceDetails =await  Piece.findOne({id})
        
        res.json(pieceDetails)
    } catch (error) {
        console.log("Error", error)
        res.json({
            message: " Failed",
            success: false
        })
    }
})
pieceRoutes.post("/pieceByUser", cors(), async (req, res)=>{

    let { twitterId} = req.body

    try {
        let pieceDetails =await  Piece.find({ownedUsers:twitterId});

        res.json(pieceDetails)
    } catch (error) {
        console.log("Error", error)
        res.json({
            message: " Failed",
            success: false
        })
    }
})
pieceRoutes.get("/previewImage/:id", cors(), async (req, res)=>{

    let id = req.params.id;

    try {
       let pieceDoc =await Piece.findOne({id});
       if(!pieceDoc) return;
       if(!pieceDoc.image) return;
       
       var img = new Buffer(pieceDoc.image.split(',')[1], 'base64');
       res.writeHead(200, {
         'Content-Type': 'image/png',
         'Content-Length': img.length 
       });
       res.end(img);


    } catch (error) {
        console.log("Error", error)
        res.json({
            message: " Failed",
            success: false
        })
    }
     
}) 