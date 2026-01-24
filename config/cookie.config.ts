import type { CookieOptions } from "express";
const accessCookieConfig: CookieOptions = {
    httpOnly: true,
    secure: process.env.ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24, // 1 day
}
const refreshCookieConfig: CookieOptions = {
    httpOnly: true,
    secure: process.env.ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 day
}

export { accessCookieConfig, refreshCookieConfig };