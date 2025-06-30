import { Request, Response } from "express";
import { User } from "../models/User";

export const getUsers = async (req: Request, res: Response) => {
  const users = await User.findAll();
  res.json(users);
};
