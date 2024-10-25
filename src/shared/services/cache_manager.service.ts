import { DolphServiceHandler } from "@dolphjs/dolph/classes";
import { Dolph } from "@dolphjs/dolph/common";
import { redisClient } from "../configs/redis.config";

export class CacheService extends DolphServiceHandler<Dolph> {
  public async save(key: string, value: any, exp?: number) {
    return redisClient.setex(key, exp || 60 * 5, JSON.stringify(value));
  }

  public async get(key: string): Promise<any> {
    const value = await redisClient.get(key);
    if (value) return JSON.parse(value);
    return null;
  }

  public async getAndRemove(key: string, exp?: number): Promise<any> {
    const value = await redisClient.getex(key, "EX", exp || 0);
    if (value) return JSON.parse(value);
    return null;
  }

  public async remove(key: string[]) {
    return redisClient.del(key);
  }
}
