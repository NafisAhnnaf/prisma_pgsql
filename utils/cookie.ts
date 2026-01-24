import { accessCookieConfig, refreshCookieConfig } from "../config/cookie.config.ts";
import type { Response } from "express";


const setAuthCookies = (res: Response, access_token: string, refresh_token: string) => {
    res.cookie('access_token', access_token, accessCookieConfig);
    res.cookie('refresh_token', refresh_token, accessCookieConfig);
}

const clearCookies = (res: Response, cookie_name: string) => {
    res.clearCookie(cookie_name);
}

export { setAuthCookies, clearCookies };