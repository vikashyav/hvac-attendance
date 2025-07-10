"use client";

import { cx } from "class-variance-authority";
import { createContext, useContext, useState, useCallback } from "react";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState({
        isOpen: false,
        message: "",
        type: "info", // info | success | error | warning
    });

    const showNotification = useCallback((message, type = "info", timeout = 3000) => {
        setNotification({ isOpen: true, message, type });

        setTimeout(() => {
            setNotification({ isOpen: false, message: "", type: "info" });
        }, timeout);
    }, []);

    const value = { showNotification };

    return (
        <NotificationContext.Provider value={value}>
            {children}

            <div
                //   onClick={notificationModal.handleOverlayClick}
                className={cx(
                    "fixed inset-0 z-[1000] flex items-center justify-center bg-black/30 transition-opacity duration-200",
                    notification.open
                        ? "opacity-100 visible"
                        : "opacity-0 invisible",
                    // notificationModal.classNames?.root
                )}
            >
                <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded shadow-md text-white transition-all
          ${notification.type === "success" ? "bg-green-600" :
                        notification.type === "error" ? "bg-red-600" :
                            notification.type === "warning" ? "bg-yellow-600 text-black" :
                                "bg-blue-600"}`}>
                    {notification.message}
                </div>
            </div>
        </NotificationContext.Provider>
    );
};
