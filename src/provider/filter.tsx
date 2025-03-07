import * as React from "react";
import { StatusFilterContext, statuses } from "@/context/filter";

export function StatusFilterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [statuses, setStatuses] = React.useState<statuses>({
    pending: false,
    "in-progress": false,
    completed: false,
  });

  const addStatusFilter = (status: string) => {
    setStatuses({ ...statuses, [status]: true });
  };

  const removeStatusFilter = (status: string) => {
    setStatuses({ ...statuses, [status]: false });
  };

  return (
    <StatusFilterContext.Provider
      value={{
        statuses,
        addStatusFilter,
        removeStatusFilter,
      }}
    >
      {children}
    </StatusFilterContext.Provider>
  );
}
