// storage
import StorageHelper from "@/services/storage/StorageHelper"

// types
import { CacheCollections, CacheData } from "@/services/storage/types"

type CacheExpireOptions = {
  cacheTime?: number
  expire?: number
}

/**
 * NOTE: This cache mechanism exists only because the application
 * doesn't have its own backend service. If it is created then
 * this cache mechanism will be moved under that.
 * But for now it's okay.
 */
class CacheHelper<D> extends StorageHelper<CacheData<D>> {
  public constructor(collectionKey: CacheCollections) {
    super(collectionKey)
  }

  public async getCachedData(cacheKey: string): Promise<D> {
    const { data } = await this.findById(cacheKey)
    return data
  }

  public async isExpired(cacheKey: string): Promise<boolean> {
    const cache = await this.findById(cacheKey)
    return !cache || Date.now() > cache.expire
  }

  public async saveToCache(cacheKey: string, data: D, expireOptions: CacheExpireOptions): Promise<CacheData<D>> {
    const {
      cacheTime = 24 * 60 * 60 * 1000,
      expire
    } = expireOptions

    return await this.save({
      id: cacheKey,
      expire: expire || Date.now() + cacheTime,
      data
    })
  }
}

export default CacheHelper
