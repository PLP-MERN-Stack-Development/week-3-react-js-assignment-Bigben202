import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useClerkAuth } from "@/hooks/useClerkAuth";

export default function ProfileAvatar() {
  const { user } = useClerkAuth();
  const initials = user?.username ? user.username.slice(0, 2).toUpperCase() : "UN";

  return (
    <Avatar className="h-10 w-10">
      <AvatarImage src={user?.imageUrl} alt={user?.username} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
