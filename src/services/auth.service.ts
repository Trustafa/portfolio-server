import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { z } from "zod";
import bcrypt from "bcrypt";
import { User, UserSession } from "../generated/prisma/client";

const inputSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  longLife: z.boolean().optional()
});

export async function loginService(req: Request, res: Response) {
  const parsedBody = inputSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const input = parsedBody.data;

  const user = await prisma.user.findUnique({
    where: { email: input.email }
  });

  if (!user) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const compare = await bcrypt.compare(input.password, user.passwordHash);

  if (!compare) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  // Session expiry
  const expiresAt = new Date();
  if (input.longLife) {
    expiresAt.setMonth(expiresAt.getMonth() + 1);
  } else {
    expiresAt.setHours(expiresAt.getHours() + 1);
  }

  // Create session in DB
  const session = await prisma.userSession.create({
    data: {
      userId: user.id,
      expiresAt,
      userAgent: req.headers["user-agent"] || "unknown",
      ipAddress: req.headers["x-forwarded-for"]?.toString() || req.ip || "unknown"
    }
  });

  // Set HTTP-only cookie
  res.cookie("session-id", session.id, {
    httpOnly: true,
    expires: expiresAt,
    sameSite: "lax",
    secure: false // set true in production with HTTPS
  });

  return res.status(204).send();
}

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string(),
  password: z.string(),
});

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}) {
  // Validate input
  const parsed = createUserSchema.parse(input);

  const user = await prisma.user.create({
    data: {
      name: parsed.name,
      email: parsed.email.toLowerCase(),
      passwordHash: await hashPassword(parsed.password),
      familyId: "1234",

    },
  });

  return user;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function findLoggedInUser(  req: Request): Promise<User | null> {
  const session = await findLoggedInSession(req);
  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  return user;
}

export async function findLoggedInSession(req: Request): Promise<UserSession | null> {
    const sessionId = req.cookies["session-id"] as string | undefined;

  if (!sessionId) {
    return null;
  }

  const session = await prisma.userSession.findUnique({
    where: {
      id: sessionId,
      active: true,
      expiresAt: { gt: new Date() },
    },
  });
  if (!session) {
    return null;
  }

  return session;
}
