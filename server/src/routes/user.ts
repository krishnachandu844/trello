import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../prisma/db";
import { authmiddleware } from "../middleware";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const isUserExists = await prisma.user.findFirst({
      where: {
        username,
      },
    });
    if (isUserExists) {
      res.status(204).json({ message: "User already exists" });
      return;
    }
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    const token = jwt.sign(
      {
        userId: newUser.id,
      },
      process.env.JWT_SECRET!,
    );
    res.cookie("token", token);
    if (!newUser) {
      return res.status(204).json({ message: "Error while creating user" });
    }
    return res.status(200).json({ message: "Signed Up Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server" });
  }
});

router.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        username,
      },
    });
    if (!user) {
      return res.status(204).json({ message: "User Doesn't exists" });
    }
    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword)
      return res.status(400).json({ message: "Invalid Password" });

    const token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.JWT_SECRET!,
    );

    res.cookie("token", token);

    return res.status(200).json({ message: "Login Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server" });
  }
});

router.get("/me", authmiddleware, async (req, res) => {
  const userId = req.userId;
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });
    if (!user) return res.status(404).json({ message: "User not Found" });
    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server" });
  }
});

router.post("/logout", authmiddleware, async (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logout Successfully" });
});

export default router;
