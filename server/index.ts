import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import user from "./src/routes/user";
import organization from "./src/routes/organization";
import board from "./src/routes/board";
import issues from "./src/routes/issues";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

app.use(express.json());
app.use(
  cors({
    credentials: true,
  }),
);
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

app.use("/api/v1", user);
app.use("/api/v1", organization);
app.use("/api/v1", board);
app.use("/api/v1", issues);

app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});
