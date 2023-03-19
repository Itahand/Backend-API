import { Router } from "express";
import mongoose from "mongoose";
import { TwitterApi } from "twitter-api-v2";
import { botConfig } from "../models/botConfigModel";
import { User } from "../models/userModel";
export const botRoutes = Router();

const twitterClient = new TwitterApi({
  clientId: process.env.TWITTER_CLIENT_ID as string,
  clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
});

const callbackURL = "http://127.0.0.1:8000/bot/callback";

botRoutes.get("/auth", async (req, res) => {
  const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(
    callbackURL,
    { scope: ["tweet.read", "tweet.write", "users.read", "offline.access"] }
  );

  await botConfig.deleteMany({});
  // store verifier
  await botConfig.insertMany({ codeVerifier, state });

  res.redirect(url);
});
botRoutes.get("/callback", async (req, res) => {
  const state = req.query.state as string;
  const code = req.query.code as string;


  let botConfigData = await botConfig.findOne({});
  if (botConfigData) {
    try {
      if (state !== botConfigData.state) {
        return res.status(400).send("Stored tokens do not match!");
      }

      let codeVerifier: string = botConfigData.codeVerifier || "";

      const {
        client: loggedClient,
        accessToken,
        refreshToken,
      } = await twitterClient.loginWithOAuth2({
        code,
        codeVerifier,
        redirectUri: callbackURL,
      });

      await User.updateOne(
        { username: process.env.TWITTER_BOT_USERNAME },
        { accessToken: accessToken, refreshToken: refreshToken }
      );
      console.log("tokens Updated");

      const { data } = await loggedClient.v2.me();

      res.status(200).send("done");
    } catch (r) {
      console.log(r);
    }
  }
});
