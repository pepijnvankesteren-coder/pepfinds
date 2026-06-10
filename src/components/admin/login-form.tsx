"use client";

import * as React from "react";
import { useActionState } from "react";
import { Lock } from "lucide-react";

import { login, type LoginState } from "@/lib/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label, FieldError } from "@/components/ui/label";

/** Password form for the admin login page. */
export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    {},
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <Label htmlFor="admin-password">Password</Label>
        <Input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
          placeholder="Enter the admin password"
          className="mt-2"
        />
        <FieldError message={state.error} />
      </div>

      <Button type="submit" size="md" className="w-full" disabled={pending}>
        <Lock />
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
