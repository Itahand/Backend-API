import mongoose from "mongoose";

const Schema = mongoose.Schema;

const pieceModel = new Schema({
  id:String,
  pieceText: String,
  authorName: String,
  createdAt: String,
  isCollected: Boolean,
  totalPiecesCollected:Number,
  amount: Number,
  image:String,
  ownedUsers:Array,
});

export const Piece = mongoose.model("piece", pieceModel);

