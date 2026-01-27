"use server";

import { hasCookie } from "cookies-next/server";
import { cookies } from "next/headers";

export async function hasAccessToken(): Promise<boolean> {
    return hasCookie("accessToken", { cookies });
}
