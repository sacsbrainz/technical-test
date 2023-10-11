import { QueryResult } from "pg";
import { dbPool } from "../utils/db";
import { User } from "@/types/users";
import { GenId } from "@/utils/helpers";

export async function createUser(
  email: string,
  password: string
): Promise<User | null> {
  const client = await dbPool.connect();
  const id = GenId();
  try {
    const query =
      "INSERT INTO users(id, email, password) VALUES($1, $2, $3) RETURNING *";
    const values = [id, email, password];
    const result: QueryResult = await client.query(query, values);
    if (result.rows.length === 0) {
      return null; // User not created
    }
    const createdUser = result.rows[0] as User;
    return createdUser;
  } catch (error) {
    return null;
  } finally {
    client.release();
  }
}

export async function findUserById(userId: string): Promise<User | null> {
  const client = await dbPool.connect();
  try {
    const query = "SELECT * FROM users WHERE id = $1";
    const values = [userId];
    const result: QueryResult = await client.query(query, values);
    const foundUser = result.rows[0] as User;
    return foundUser;
  } catch (error) {
    return null;
  } finally {
    client.release();
  }
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const client = await dbPool.connect();
  try {
    const query = "SELECT * FROM users WHERE email = $1";
    const values = [email];
    const result: QueryResult = await client.query(query, values);
    const foundUser = result.rows[0] as User;
    return foundUser;
  } catch (error) {
    return null;
  } finally {
    client.release();
  }
}

export async function updateUserEmailVerification(
  userId: string
): Promise<boolean> {
  const client = await dbPool.connect();
  try {
    const query = "UPDATE users SET email_verified = true WHERE id = $1";
    const values = [userId];
    await client.query(query, values);
    return true;
  } catch (error) {
    return false;
  } finally {
    client.release();
  }
}

export async function changePassword(
  userId: string,
  newPassword: string
): Promise<boolean> {
  const client = await dbPool.connect();
  try {
    const query = "UPDATE users SET password = $1 WHERE id = $2";
    const values = [newPassword, userId];
    await client.query(query, values);
    return true;
  } catch (error) {
    return false;
  } finally {
    client.release();
  }
}
