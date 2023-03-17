import { Router } from "express";
export const pieceRoutes = Router();
import { Piece } from "../models/pieceModel";
import cors from "cors";

const nodeHtmlToImage = require("node-html-to-image");
const font2base64 = require("node-font2base64");
const _dataLora = font2base64.encodeToDataUrlSync(
  __dirname + "/../font/Lora-Regular.ttf"
);
const _dataOpenSans = font2base64.encodeToDataUrlSync(
  __dirname + "/../font/OpenSans-Regular.ttf"
);

pieceRoutes.post("/listingPiece", cors(), async (req, res) => {
  let { id } = req.body;

  try {
    let pieceDetails = await Piece.findOne({ id });

    res.json(pieceDetails);
  } catch (error) {
    console.log("Error", error);
    res.json({
      message: " Failed",
      success: false,
    });
  }
});
pieceRoutes.post("/pieceByUser", cors(), async (req, res) => {
  let { twitterId } = req.body;

  try {
    let pieceDetails = await Piece.find({ ownedUsers: twitterId });

    res.json(pieceDetails);
  } catch (error) {
    console.log("Error", error);
    res.json({
      message: " Failed",
      success: false,
    });
  }
});
pieceRoutes.get("/previewImage/:id", cors(), async (req, res) => {
  let id = req.params.id;

  try {
    let pieceDoc = await Piece.findOne({ id });
    if (!pieceDoc) return;
    if (!pieceDoc.image) return;

    var img = new Buffer(pieceDoc.image.split(",")[1], "base64");
    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": img.length,
    });
    res.end(img);
  } catch (error) {
    console.log("Error", error);
    res.json({
      message: " Failed",
      success: false,
    });
  }
});
pieceRoutes.get("/testImage/:id", cors(), async (req, res) => {
  let id = req.params.id;

  try {
    let pieceDoc = await Piece.findOne({ id });
    if (!pieceDoc) return;
    if (!pieceDoc.image) return;
    let img1 = await createImage(
      pieceDoc.pieceText,
      pieceDoc.createdAt,
      pieceDoc.authorName
    );
    var img = new Buffer(img1.split(",")[1], "base64");
    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": img.length,
    });
    res.end(img);
  } catch (error) {
    console.log("Error", error);
    res.json({
      message: " Failed",
      success: false,
    });
  }
});

let createImage = async (
  pieceText: any,
  formattedDate: any,
  authorName: any
) => {
  const image = await nodeHtmlToImage({
    html: `
         
    <html class="focus-outline-visible"><head>
    <style>
    @font-face {
      font-family: 'lora';
      src: url(${_dataLora}) format('woff2'); // don't forget the format!
      }
    @font-face {
      font-family: 'opensans';
      src: url(${_dataOpenSans}) format('woff2'); // don't forget the format!
      }
       body {
          width: 52rem;
  
          background-color: #faeddd;
          height: fit-content;
          display: flex;
          justify-content: center;
          min-height:30vh;
       }
    </style>
  </head>
  <body>
    <div id="my-node" style="
    display: flex;
    background-color: white;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 1rem;
    width: 20rem;
    height: fit-content;
    min-height: 30vh;
    margin: 10px;
    padding: 1.7rem;
       ">
       <div style="
       font-family: 'lora';
font-style: normal;
font-weight: 400;
font-size: 15.1502px;   
line-height: 150%;
hyphens: auto;
color: #312E2A;
word-break: break-all;
      height: fit-content;min-height: 45vh;">
       ${pieceText}
            </div>
       <div style=" 
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family:'opensans';
          font-style: normal;
font-weight: 500;
font-size: 13px;
line-height: 18px;
color: #7A756E;
          ">
          @${authorName}
          <div classname="cardDate"
          style="
          font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 18px;
    color: #7A756E;
    font-family: 'opensans'; 
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    width: 39%;
          "
          >
          ${formattedDate.split(" ")[1]}
          <div classname="cardDate" style="height: 3px;width: 3px;background: #7A756E;border-radius: 50%;"></div>
          ${formattedDate.split(" ")[0]}
          </div>
       </div>
    </div> 
  
  </body></html>
          `,
    puppeteerArgs: { args: ["--no-sandbox"] },
  });  
  return "data:image/png;base64," + image.toString("base64");
};
