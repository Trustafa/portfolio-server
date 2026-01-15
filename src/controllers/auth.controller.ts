import { Request, Response } from "express";
import { findLoggedInUser, loginService , registerUser} from "../services/auth.service";
import { toUserResponse } from "../services/user.service";
import { User } from "../generated/prisma/client";
import { success } from "zod";


export async function register(req: Request, res: Response) {
  try {
    const user = await registerUser(req.body);
    res.status(201).json(toUserResponse(user));
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
}


export async function login(req: Request, res: Response) {
  try {
    const result = await loginService(req, res);
    return res.status(204).json({success: true}); 
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function getMe(req: Request, res: Response)
{
  const user = await findLoggedInUser(req);

  if (user)
  {
    const data = toUserResponse(user);
    return res.status(200).json({success: true, ...data});
  }
  else
  {
    return res.status(401).json({success: false})
  }
}

