import morgan from "morgan";
import Logger from "@/utils/logger";
import dotenv from "dotenv";
dotenv.config();

const stream = {
  write: (message: string) => Logger.http(message),
};
const skip = () => {
  return process.env.NODE_ENV !== "development";
};

const morganMiddleware = morgan("short", { stream, skip });

export default morganMiddleware;
