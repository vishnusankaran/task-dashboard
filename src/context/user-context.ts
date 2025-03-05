import * as React from "react";

import type { User } from "@/types";

type UserContextType = [
  User | null,
  React.Dispatch<React.SetStateAction<User | null>>,
];

export const UserContext = React.createContext<UserContextType>([
  null,
  () => {},
]);
