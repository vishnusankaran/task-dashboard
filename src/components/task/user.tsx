import { UserAvatar } from "@/components/task/user-avatar";
import { User as UserType } from "@/types";

export function User({
  user = {},
  showName,
}: {
  user: UserType;
  showName?: boolean;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border-2 px-2 py-1">
      <UserAvatar user={user} />
      {showName && <span className="text-sm font-medium">{user?.name}</span>}
    </div>
  );
}
