"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const cookieNames = ["level_up_access_token"];

type CookieJar = Awaited<ReturnType<typeof cookies>>;

export async function clearAuthCookies(jar: CookieJar) {
  for (const name of cookieNames) {
    jar.delete(name);
  }
}

export async function logoutAction() {
  const jar = await cookies();
  await clearAuthCookies(jar);
  redirect("/login");
}
