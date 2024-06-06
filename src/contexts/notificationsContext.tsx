import { createContext, useEffect, useState } from "react"
import React from "react"
import { Notification } from "../types/server/class/Notification"
import { useUser } from "../hooks/useUser"

interface NotificationContextValue {
    notifications: Notification[]
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>
    addNotification: (notification: Notification) => void
}

interface NotificationProviderProps {
    children: React.ReactNode
}

const NotificationContext = createContext<NotificationContextValue>({} as NotificationContextValue)

export default NotificationContext

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const { user } = useUser()
    const [notifications, setNotifications] = useState<Notification[]>([])

    const addNotification = (notification: Notification) => {
        setNotifications((notifications) => [...notifications, notification])
    }

    useEffect(() => {
        if (user) {
            setNotifications(user.notifications)
        }
    }, [user])

    return <NotificationContext.Provider value={{ notifications, setNotifications, addNotification }}>{children}</NotificationContext.Provider>
}
