import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types";

export function UserAvatar({ user = {} }: { user: User }) {
  return (
    <Avatar className="size-[24px] border-1 border-slate-300">
      <AvatarImage
        src={user?.avatar || "https://github.com/shadcn.png"}
        alt={user?.name}
      />
      <AvatarFallback className="uppercase">
        {user?.name
          ?.split(" ")
          .map((name: string) => name.charAt(0))
          .join("")}
      </AvatarFallback>
    </Avatar>
  );
}
