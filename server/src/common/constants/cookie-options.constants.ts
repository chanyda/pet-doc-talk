import { CookieOptions } from "express";

const TOKEN_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
};

export const ACCESS_TOKEN_COOKIE_OPTIONS = {
    ...TOKEN_COOKIE_OPTIONS,
    maxAge: 1000 * 60 * 60 * 24,
} as CookieOptions;

export const REFRESH_TOKEN_COOKIE_OPTIONS = {
    ...TOKEN_COOKIE_OPTIONS,
    maxAge: 1000 * 60 * 60 * 24 * 30,
} as CookieOptions;
