import Redis from "ioredis";
import { redisConfigs } from "./envs.config";
import { logger } from "@dolphjs/dolph/utilities";

export const redisClient = new Redis({
  host: redisConfigs.host as string,
  port: redisConfigs.port as number,
  // password: redisConfigs.password as string,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

redisClient.on("connect", () => {
  logger.info(`[App Info]: Connection to RedisDB successful`);
});

redisClient.on("error", (err: any) => {
  logger.error(`[App Error]: Connection to RedisDB failed, ${err}`);
});
