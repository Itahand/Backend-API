import mongoose from "mongoose";

const Schema = mongoose.Schema;

const bot = new Schema({
    codeVerifier:String,
    state:String,
   
});

export const botConfig = mongoose.model("botConfig", bot);

