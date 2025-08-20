import { useUser, useClerk, useAuth } from "@clerk/clerk-react";

export function useClerkAuth() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { getToken } = useAuth();
  return { user, signOut, getToken };
} 