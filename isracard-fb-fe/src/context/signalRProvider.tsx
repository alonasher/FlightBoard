import React, { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react";
import { startConnection, stopConnection, getConnection } from "../services/flightSignalRService";
import * as signalR from "@microsoft/signalr";

interface SignalRProviderProps {}

const SignalRContext = createContext<signalR.HubConnection | null>(null);

export const SignalRProvider = (props: PropsWithChildren<SignalRProviderProps>) => {
  const { children } = props;
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

  useEffect(() => {
    startConnection().then(() => {
      setConnection(getConnection());
    });

    return () => {
      stopConnection();
    };
  }, []);

  return (
    <SignalRContext.Provider value={connection}>
      {children}
    </SignalRContext.Provider>
  );
};

export const useSignalR = () => useContext(SignalRContext);