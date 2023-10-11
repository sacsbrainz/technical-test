import { redis } from '@/app';
import { findUserById } from '@/models/userModel';
import { User } from '@/types/users';

export async function getUserById(userId: string) {
  const cachedUser = await redis.get(`user:${userId}`);
  if (cachedUser) {
    return JSON.parse(cachedUser) as User | null;
  }

  const user = await findUserById(userId);
  if (user) {
    await redis.set(`user:${userId}`, JSON.stringify(user));
  }

  return user;
}
