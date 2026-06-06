import express from "express";
import { authmiddleware } from "../middleware";
import { prisma } from "../../prisma/db";

const router = express.Router();

//Board Routes

router.post("/add-board", authmiddleware, async (req, res) => {
  const { title, description, orgId } = req.body;
  try {
    await prisma.board.create({
      data: {
        title,
        description,
        orgId,
      },
    });
    return res.status(200).json({ message: "Board Created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Error" });
  }
});

router.get("/boards/:orgId", authmiddleware, async (req, res) => {
  const { orgId } = req.params;
  try {
    const boards = await prisma.board.findMany({
      where: {
        orgId: orgId as string,
      },
    });
    return res.status(200).json({ boards });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Error" });
  }
});

router.delete("/board/:boardId", authmiddleware, async (req, res) => {
  const { orgId } = req.params;
  try {
    const boards = await prisma.board.findMany({
      where: {
        orgId: orgId as string,
      },
    });
    return res.status(200).json({ boards });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Error" });
  }
});

export default router;
