import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRouter";
import flashcardRouter from "./routes/flashcardRouter";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const app = express();
const corsOptions = process.env.IS_DEV
  ? {
      origin: true,
      credentials: true,
    }
  : {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    };
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/flashcards", flashcardRouter);

if (process.env.IS_DEV) {
  app.use(
    "/",
    createProxyMiddleware({
      target: "http://localhost:5173",
      changeOrigin: true,
    }),
  );
} else {
  app.use(express.static("public"));

  app.use("/", (req, res) => {
    (res.sendFile("./public/index.html"),
      { root: "." },
      (error: any) => {
        if (error) {
          console.error("Error sending index.html:", error);
          res.status(500).json({ message: "Internal Server Error" });
        }
      });
  });
}

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
