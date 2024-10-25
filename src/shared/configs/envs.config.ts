export const redisConfigs = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || "password",
};

export const serverConfigs = {
  sessionSecret: process.env.SESSION_SECRET || "sessionxxxsessionunpredictable",
  env: process.env.ENV || "development",
};
