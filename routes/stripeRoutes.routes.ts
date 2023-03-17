import { Router } from "express"; 
export const stripeRoutes = Router();
import cors from 'cors';
import { Piece } from "../models/pieceModel";
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST)

stripeRoutes.post("/payment", cors(), async (req, res)=>{
    let {amount, id,listingId,twitterId} = req.body

    try {
        const payment = await stripe.paymentIntents.create({
            amount,
            currency: "USD",
            description: "Payment",
            payment_method: id,
            confirm: true
        })

        let pieceDetails = await Piece.findOne({id:listingId});
        let totalPiecesCollected = pieceDetails?.totalPiecesCollected?pieceDetails?.totalPiecesCollected +1:1;
        
        await Piece.updateOne({id:listingId},{isCollected:true,totalPiecesCollected:totalPiecesCollected,$push:{"ownedUsers":twitterId}})
        res.json({
            message: "Payment was successful",
            success: true
        })
    } catch (error) {
        console.log("Error", error)
        res.json({
            message: "Payment Failed",
            success: false
        })
    }
})