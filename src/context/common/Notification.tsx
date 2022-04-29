import React from 'react';
import { createContext, ReactNode, useContext } from "react";
import { toast } from "react-toastify";

interface INotificationsContext {
  addTxNotification: (tx: any, type: string, explorerUrl: string) => void;
}

const NotificationsContext = createContext<INotificationsContext | null>(null);

const NotificationsProvider = ({ children }: { children: ReactNode }) => {

  const addTxNotification = (tx: any, type: string, explorerUrl: string) => {
    toast.promise(
      tx.wait(1),
      {
        pending: `${type} transaction pending`,
        error: `${type} transaction failed`,
        success: `${type} transaction confirmed`,
      },
      {
        onClick: () => {
          window.open(explorerUrl, "_blank");
        },
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "font-sans font-medium",
      }
    );
  };

  return (
    <NotificationsContext.Provider value={{ addTxNotification }}>
      {children}
    </NotificationsContext.Provider>
  );
};

const useNotifications = () => useContext(NotificationsContext);
export { NotificationsProvider, useNotifications };
