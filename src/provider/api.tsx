import * as React from "react";
import { Client, Provider, cacheExchange, fetchExchange } from "urql";

const client = new Client({
  url: "http://localhost:4000/graphql",
  exchanges: [cacheExchange, fetchExchange],
});

export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  return <Provider value={client}>{children}</Provider>;
};
