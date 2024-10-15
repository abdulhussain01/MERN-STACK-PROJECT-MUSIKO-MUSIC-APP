import express from "express";
import dbConnect from "./db/dbConnect.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import userRouter from "./routes/user.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import { errorHandler } from "./middleware/handleError.js";
import cors from "cors";

const app = express();
dotenv.config({ path: "./config/config.env" });

app.use(
  cors({
    origin: [process.env.MUSICAPP_URL],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());



app.use(express.json());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/v1/user", userRouter);

app.use("/api/v1/playlist", playlistRouter);

dbConnect();

app.use(errorHandler);
export default app;
