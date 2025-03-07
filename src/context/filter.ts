import * as React from "react";

export type statuses = {
  pending: boolean;
  "in-progress": boolean;
  completed: boolean;
};

type FilterContextType = {
  statuses: statuses;
  addStatusFilter: (status: string) => void;
  removeStatusFilter: (status: string) => void;
};

export const StatusFilterContext = React.createContext<FilterContextType>({
  statuses: {
    pending: false,
    "in-progress": false,
    completed: false,
  },
  addStatusFilter: () => {},
  removeStatusFilter: () => {},
});
