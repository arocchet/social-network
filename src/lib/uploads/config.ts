const disableUpload = process.env.NODE_ENV === 'test'
const fallbackAvatarUrl = process.env.FALLBACK_AVATAR_URL
const fallbackCoverUrl = process.env.FALLBACK_COVER_URL

export { disableUpload, fallbackAvatarUrl, fallbackCoverUrl }