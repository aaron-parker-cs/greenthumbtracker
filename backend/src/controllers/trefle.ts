import { Request, Response } from "express";
import axios from "axios";

export const getTrefleClientToken = async (req: Request, res: Response) => {
    try {
        if (!process.env.TREFLE_SECRET_TOKEN) {
            console.error("❗TREFLE_SECRET_TOKEN is not set in environment variables.");
            return res.status(500).json({ message: "Server configuration error." });
        }
      const response = await axios.post(
        "https://trefle.io/api/auth/claim",
        {
          token: process.env.TREFLE_SECRET_TOKEN,
          origin: "greenthumb-ios-app",     //mainly for if request is coming from a web browser, not applicable for iOS app 
          ip: null
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.TREFLE_SECRET_TOKEN}`,
            "content-Type": "application/json"
          }
        }
      );
  
      const { token, expiration } = response.data;
      //send the secret token
      res.json({ token, expiration });
    } catch (error) {
        console.error("❗Error fetching Trefle client token:", error);

        if (axios.isAxiosError(error) && error.response) {
            console.error("❗Trefle API error status:", error.response.status);
            console.error("❗Trefle API error data:", error.response.data);
        }

        res.status(500).json({ message: "Failed to fetch client token from Trefle" });
    }
  };
  
