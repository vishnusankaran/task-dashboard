import * as React from "react";
import { UserContext } from "@/context/user";
import type { User } from "@/types";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>({
    id: "asdfghjkl",
    name: "Vishnu Sankaran",
    avatar: "https://avatars.githubusercontent.com/u/4065909?v=4",
    email: "vishnu88sankaran@gmail.com",
  });

  return (
    <UserContext.Provider value={[user, setUser]}>
      {children}
    </UserContext.Provider>
  );
}
