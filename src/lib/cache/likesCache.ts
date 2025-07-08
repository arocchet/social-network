class LikesCache {
  private cache = new Map<
    string | number,
    { isLiked: boolean; likesCount: number }
  >();

  get(key: string | number) {
    return this.cache.get(key);
  }

  set(key: string | number, value: { isLiked: boolean; likesCount: number }) {
    this.cache.set(key, value);
  }
}

export const likesCache = new LikesCache();
