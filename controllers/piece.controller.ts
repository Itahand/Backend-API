import { Piece } from "../models/pieceModel";
const nodeHtmlToImage = require("node-html-to-image");
const font2base64 = require('node-font2base64')
const _data = font2base64.encodeToDataUrlSync(__dirname+'/../font/OpenSans-Regular.ttf')

export const savePieceListingData = async (
  id: String,
  amount: String,
  authorUserName: String,
  createdAt: String,
  pieceText: String
) => {
 
  // Split the createdAt string to extract the year, month, day, hour, and minute components
  const [dateString, timeString] = createdAt.split("T");
  const [year, month, day] = dateString.split("-");
  const [hour, minute] = timeString.slice(0, -1).split(":");

  // Create a date object from the extracted components, assuming UTC timezone
  const date = new Date(
    Date.UTC(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute)
    )
  );

  // Format the date components into a string with the desired format
  const formattedDate = `${month.padStart(2, "0")}/${day.padStart(
    2,
    "0"
  )}/${year} ${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;

  let img = await createImage(pieceText, formattedDate, authorUserName);

    const PieceLen = await Piece.find();

  const newPiece = await new Piece({
    id: PieceLen.length+1,
    amount: amount,
    authorUserName: authorUserName, 
    isCollected: false,
    createdAt: createdAt,
    pieceText: pieceText,
    image:img
  }).save();

  return newPiece.id;
};

let createImage = async (
  pieceText: any,
  formattedDate: any,
  authorUserName: any
) => {
  const image = await nodeHtmlToImage({
    html: `
       
  <html class="focus-outline-visible"><head>
  <style>
  @font-face {
    font-family: 'opensans';
    src: url(${_data}) format('woff2'); // don't forget the format!
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
     padding: 1rem;
     background-color: white;
     flex-direction: column;
     justify-content: space-between;
     border-radius: 0.5rem;
     width: 20rem;

     font-family: 'opensans'; 
     height:fit-content;
     min-height: 30vh;
     margin:10px;
     ">
     <div style="text-align: justify; height: fit-content;min-height: 45vh;">
     ${pieceText}
          </div>
     <div style="
        height: 7vh;
        display: flex;
        align-items: center;
        justify-content: space-between;
        ">
        @${authorUserName}
        <div classname="cardDate">
        ${formattedDate}
        </div>
     </div>
  </div> 

</body></html>
        `,
  });

  return "data:image/png;base64," + image.toString("base64")

};
