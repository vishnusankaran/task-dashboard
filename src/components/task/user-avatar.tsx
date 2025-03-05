import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserAvatar({ user }) {
  return (
    <Avatar className="size-[24px]">
      <AvatarImage
        src={user.avatar || "https://github.com/shadcn.png"}
        alt={user.name}
      />
      <AvatarFallback className="uppercase">
        {user.name
          .split(" ")
          .map((name: string) => name.charAt(0))
          .join("")}
      </AvatarFallback>
    </Avatar>
  );
}
