import express from "express";

import { authmiddleware } from "../middleware";
import { prisma } from "../../prisma/db";

const router = express.Router();

router.post("/add-organization", authmiddleware, async (req, res) => {
  const userId = req.userId;
  const { title, description } = req.body;
  try {
    const newOrg = await prisma.organization.create({
      data: {
        title,
        description,
        owner: userId,
      },
    });
    if (!newOrg)
      return res.status(411).json({ message: "Unable to create org" });
    return res
      .status(200)
      .json({ message: "Organization Created Successfully" });
  } catch (error) {
    console.log(error);
  }
});

router.post("/add-member", authmiddleware, async (req, res) => {
  const userId = req.userId;
  const { orgId, memberId } = req.body;
  try {
    const org = await prisma.organization.findFirst({
      where: {
        id: orgId as string,
      },
    });

    if (!org || !(org?.owner == userId)) {
      return res
        .status(411)
        .json({ message: "You are not authorised or Org not found" });
    }

    const memberUser = await prisma.user.findFirst({
      where: {
        id: memberId as string,
      },
    });

    if (!memberUser) {
      return res.status(411).json({ message: "User not found" });
    }

    const newMember = await prisma.member.create({
      data: {
        userId: memberId as string,
        orgId: orgId as string,
      },
    });

    return res.status(200).json({
      Message: "Added memeber successfully",
    });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/delete-member", authmiddleware, async (req, res) => {
  const userId = req.userId;
  const { orgId, memberId, deleteUserId } = req.body;
  try {
    const org = await prisma.organization.findFirst({
      where: {
        id: orgId as string,
      },
    });

    if (!org || !(org?.owner == userId)) {
      return res
        .status(411)
        .json({ message: "You are not authorised or Org not found" });
    }

    const memberUser = await prisma.user.findFirst({
      where: {
        id: memberId as string,
      },
    });

    if (!memberUser) {
      return res.status(411).json({ message: "User not found" });
    }

    const deleteMem = await prisma.member.delete({
      where: {
        id: deleteUserId,
      },
    });

    return res.status(200).json({
      Message: "Member Deleted successfully",
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/organization/:orgId", authmiddleware, async (req, res) => {
  try {
    const { orgId } = req.params;
    const userId = req.userId;
    const org = await prisma.organization.findFirst({
      where: {
        id: orgId as string,
      },
    });

    if (!org || !(org?.owner == userId)) {
      return res
        .status(411)
        .json({ message: "You are not authorised or Org not found" });
    }

    const organization = await prisma.organization.findFirst({
      where: {
        id: orgId as string,
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });

    const data = {
      id: organization?.id,
      title: organization?.title,
      description: organization?.description,
      owner: organization?.owner,
      members: organization?.members.map((m) => ({
        id: m.user.id,
        email: m.user.email,
        username: m.user.username,
      })),
    };

    return res.status(200).json({ organization: data });
  } catch (error) {
    console.log(error);
  }
});

router.get("/members", authmiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const members = await prisma.user.findMany({
      where: {
        NOT: {
          id: userId,
        },
      },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });

    res.status(200).json({ members });
  } catch (error) {
    console.log(error);
  }
});

export default router;
