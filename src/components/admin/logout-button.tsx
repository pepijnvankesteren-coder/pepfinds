import { LogOut } from "lucide-react";

import { logout } from "@/lib/actions/auth-actions";
import { Button } from "@/components/ui/button";

/** Ends the admin session. Rendered in the admin header when signed in. */
export function LogoutButton() {
  return (
    <form action={logout}>
      <Button type="submit" variant="ghost" size="sm">
        <LogOut />
        Sign out
      </Button>
    </form>
  );
}
