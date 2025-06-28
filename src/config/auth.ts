export const JWT_EXPIRATION = {
    TEN_MINUTES: "10m",
    HOUR: "60m",
    DAY: "1d",
    WEEK: "7d",
    MONTH: "30d",
    DEFAULT: "480m", // 8 heures
} as const;