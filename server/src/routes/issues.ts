import express from "express";
import { authmiddleware } from "../middleware";
import { prisma } from "../../prisma/db";

const router = express.Router();

// Issue Routes

router.post("/add-issue", authmiddleware, async (req, res) => {
  const { title, description, boardId } = req.body;
  try {
    await prisma.issue.create({
      data: {
        title,
        description,
        status: "TODO",
        boardId,
      },
    });
    return res.status(200).json({ message: "Issue Created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Error" });
  }
});

router.get("/issues/:boardId", authmiddleware, async (req, res) => {
  const { boardId } = req.params;
  try {
    const issues = await prisma.issue.findMany({
      where: {
        boardId: boardId as string,
      },
    });
    return res.status(200).json({ issues });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Error" });
  }
});

router.put("/update-issue", authmiddleware, async (req, res) => {
  const { title, description, boardId, status } = req.body;
  try {
    await prisma.issue.create({
      data: {
        title,
        description,
        status,
        boardId,
      },
    });
    return res.status(200).json({ message: "Issue Updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Error" });
  }
});

router.delete("/issue/:issueId", authmiddleware, async (req, res) => {
  const { issueId } = req.params;
  try {
    const board = await prisma.issue.delete({
      where: {
        id: issueId as string,
      },
    });
    return res.status(200).json({ message: "Issue Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Error" });
  }
});

export default router;
