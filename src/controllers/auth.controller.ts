import { Request, Response } from "express";
import { loginService , registerUser} from "../services/auth.service";
import { toUserResponse } from "../services/user.service";


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
    return result; 
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

