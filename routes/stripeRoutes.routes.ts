/** @format */

import { Router } from "express";
export const stripeRoutes = Router();
import cors from "cors";
import { Piece } from "../models/pieceModel";
import FlowService from "../services/Flow/Flow.service";
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST);

stripeRoutes.post("/payment", cors(), async (req, res) => {
  let { amount, id, listingId, twitterId } = req.body;

  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      description: "Payment",
      payment_method: id,
      confirm: true,
    });

    let pieceDetails = await Piece.findOne({ id: listingId });
    let totalPiecesCollected = pieceDetails?.totalPiecesCollected
      ? pieceDetails?.totalPiecesCollected + 1
      : 1;

    await Piece.updateOne(
      { id: listingId },
      {
        isCollected: true,
        totalPiecesCollected: totalPiecesCollected,
        $push: { ownedUsers: twitterId },
      }
    );
    res.json({
      message: "Payment was successful",
      success: true,
    });
  } catch (error) {
    console.log("Error", error);
    res.json({
      message: "Payment Failed",
      success: false,
    });
  }
});

stripeRoutes.post("/mintNFT", cors(), async (req, res) => {
  let { twitterId, tweetText, address } = req.body;

  try {
    const jobResponse3 = await FlowService.mintNFT(
      twitterId,
      tweetText,
      address
    );
    res.send(jobResponse3);
  } catch (error) {
    console.log("Error", error);
    res.json({
      message: "Minting Failed",
      success: false,
    });
  }
});
