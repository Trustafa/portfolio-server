import { User } from "../generated/prisma/client";

export type UserResponse = {
  id: string;
  createdAt: string;
  updatedAt: string;

  email: string;
  name: string;
};

export function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    email: user.email,
    name: user.name,
  };
}