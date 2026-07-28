import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRouter";

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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
