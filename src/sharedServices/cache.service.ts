/* eslint-disable prettier/prettier */
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {

    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    async get(key: string): Promise<any> {
        const value = await this.cacheManager.get(key)
        return value;
    }

    async set(key: string, value: any): Promise<void> {
        await this.cacheManager.set(key, value);
    }
}
