import { Router, Request, Response } from "express";
import { prisma } from "../config/prisma"; 
import { findLoggedInUser } from "../services/auth.service";

const router = Router();

router.get("/members", async (req: Request, res: Response) => {
  const user = await findLoggedInUser(req);
  if (!user) {
    return res.status(401).json({error: 'Unauthorized'});
  }
  try {
    const family = await prisma.family.findUnique({
      where: { id: user.familyId },
      select: {
        id: true,
        name: true,
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true
          },
          where: { deletedAt: null }
        }
      }
    });

    if (!family) {
      return res.status(404).json({ error: "Family not found" });
    }

    return res.status(200).json(family.members);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
