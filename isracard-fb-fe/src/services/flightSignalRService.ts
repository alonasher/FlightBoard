import * as signalR from "@microsoft/signalr";

const SIGNAL_R_URL = "http://localhost:5256/flightStatusHub";
let connection: signalR.HubConnection | null = null;

export const getConnection = () => connection;

export const startConnection = async () => {
  if (!connection) {
    connection = new signalR.HubConnectionBuilder()
      .withUrl(SIGNAL_R_URL)
      .withAutomaticReconnect()
      .build();
  }
  if (connection.state === signalR.HubConnectionState.Disconnected) {
    await connection.start();
  }
};

export const stopConnection = async () => {
  if (connection && connection.state !== signalR.HubConnectionState.Disconnected) {
    await connection.stop();
  }
};

export const onFlightStatusUpdate = (callback: (flight: any) => void) => {
  if (connection) {
    connection.on("ReceiveFlightStatusUpdate", callback);
  }
};