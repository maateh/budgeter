// storage
import StorageHelper from "@/services/storage/StorageHelper"

// types
import { CacheData, CacheKeys } from "@/services/storage/types"

/**
 * NOTE: This cache mechanism exists only because the application
 * doesn't have its own backend service. If it is created then
 * this cache mechanism will be moved under that.
 * But for now it's okay.
 */
class CacheHelper<D> extends StorageHelper<CacheData<D>> {
  private key: CacheKeys

  public constructor(key: CacheKeys) {
    super('cache')
    this.key = key
  }

  public async getCachedData(): Promise<D> {
    const { data } = await this.findById(this.key)
    return data
  }

  public async isExpired(): Promise<boolean> {
    const cache = await this.findById(this.key)

    return !cache || Date.now() > cache.expire
  }

  public async saveToCache(data: D, cacheTime: number = 24 * 60 * 60 * 1000): Promise<CacheData<D>> {
    return await this.save({
      id: this.key,
      expire: Date.now() + cacheTime,
      data
    })
  }
}

export default CacheHelper
