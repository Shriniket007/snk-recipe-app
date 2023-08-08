import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 3001;

import { userRouter } from "./src/routes/users.js";

import { recipesRouter } from "./src/routes/recipes.js";

const app = express();

app.use(express.json());

app.use(cors()); //making api reuest from frontend

app.use("/auth", userRouter);

app.use("/recipes", recipesRouter);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// mongoose.connect(process.env.MONGO_URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("listening for requests");
  });
});

// app.listen(3001, () => {
//   console.log("server started");
// });
