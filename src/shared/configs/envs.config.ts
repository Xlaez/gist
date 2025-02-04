export const redisConfigs = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || "password",
};

export const serverConfigs = {
  sessionSecret: process.env.SESSION_SECRET || "sessionxxxsessionunpredictable",
  env: process.env.ENV || "development",
  jwt: {
    prodExpiration: process.env.JWT_EXPIRATION_PROD || 60,
    devExpiration: process.env.JWT_EXPIRATION_DEV || 60,
    secret: process.env.JWT_SECRET || "secretissostring",
  },
};

export const postgresConfig = {
  user: process.env.POSTGRES_USER || "user",
  pass: process.env.POSTGRES_PASSWORD || "password123",
  db: process.env.POSTGRES_DB || "gist",
  port: 5432,
};
