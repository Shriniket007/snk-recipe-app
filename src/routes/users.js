import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose"; // Import mongoose

const router = express.Router();

import { Usermodel } from "../models/Users.js";

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const user = await Usermodel.findOne({ username }); //checking in db whether the name enterred here matches in the db

  // if username matches that entered in front as in db
  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }

  //if there is no such usename we come here and hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new Usermodel({
    username,
    password: hashedPassword,
  });

  await newUser.save();

  res.json({ message: "User registered successfully" });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await Usermodel.findOne({ username });

  //if user is not found in db
  if (!user) {
    return res.status(400).json({ message: "User Does'nt exists!" });
  }

  //here we compare the password by again encrypting the one entered with the one in db
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res
      .status(400)
      .json({ message: "Username or password is Incorrect" });
  }

  //for authentication session creation
  const token = jwt.sign({ id: user._id }, process.env.TOKEN);

  res.json({ token, userID: user._id });
});

export { router as userRouter };

//middleware
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    jwt.verify(authHeader, process.env.TOKEN, (err) => {
      if (err) {
        return res.sendStatus(403);
      }
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

//changed
// //middleware
// export const verifyToken = (req, res, next) => {
//   const token = req.headers.authorization;
//   if (token) {
//     jwt.verify(token.split(" ")[1], process.env.TOKEN, (err) => {
//       // Extract token from "Authorization" header
//       if (err) return res.sendStatus(403);
//       next();
//     });
//   } else {
//     res.sendStatus(401);
//   }
// };
