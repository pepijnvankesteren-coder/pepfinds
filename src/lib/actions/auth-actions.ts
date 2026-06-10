"use server";

import { redirect } from "next/navigation";

import {
  createSession,
  destroySession,
  verifyAdminPassword,
} from "@/lib/auth";

export interface LoginState {
  error?: string;
}

/** Validate the admin password and start a session. */
export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");

  if (!password || !verifyAdminPassword(password)) {
    // Small fixed delay to blunt brute-force attempts.
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { error: "Incorrect password." };
  }

  await createSession();
  redirect("/admin");
}

/** End the admin session. */
export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
