import React, { useEffect, useRef, useState } from "react"
import { Platform, View } from "react-native"
import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import Constants from "expo-constants"
import { Button, Text } from "react-native-paper"
import { useUser } from "../hooks/useUser"
import { api } from "../backend/api"
import { NavigationProp, useNavigation } from "@react-navigation/native"

interface NotificationsHandlerProps {}

Notifications.setNotificationHandler({
    handleNotification: async (data) => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
    }),
})

function handleRegistrationError(errorMessage: string) {
    alert(errorMessage)
    throw new Error(errorMessage)
}

async function registerForPushNotificationsAsync() {
    if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
            bypassDnd: true,
        })
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync()
        let finalStatus = existingStatus
        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync()
            finalStatus = status
        }
        if (finalStatus !== "granted") {
            handleRegistrationError("Permission not granted to get push token for push notification!")
            return
        }
        const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId
        if (!projectId) {
            handleRegistrationError("Project ID not found")
        }
        try {
            const pushTokenString = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data
            console.log(pushTokenString)
            return pushTokenString
        } catch (e: unknown) {
            handleRegistrationError(`${e}`)
        }
    } else {
        handleRegistrationError("Must use physical device for push notifications")
    }
}

export const NotificationsHandler: React.FC<NotificationsHandlerProps> = ({}) => {
    const { user, setUser, setExpoPushToken, expoPushToken, updateNotification, sendViewedNotification } = useUser()
    const notificationListener = useRef<Notifications.Subscription>()
    const responseListener = useRef<Notifications.Subscription>()
    const navigation = useNavigation<NavigationProp<any, any>>()

    const saveExpoPushToken = async () => {
        if (!user || !expoPushToken) return
        if (user.expoPushToken?.includes(expoPushToken)) return

        try {
            const response = await api.patch("/user", { id: user.id, expoPushToken: [...(user.expoPushToken || []), expoPushToken] })
            setUser(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchNotification = async (id: string) => {
        if (!user) return
        try {
            const response = await api.get("/notification", { params: { notification_id: id } })
            console.log(response.data)
            updateNotification(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        registerForPushNotificationsAsync()
            .then((token) => setExpoPushToken(token ?? ""))
            .catch((error: any) => setExpoPushToken(`${error}`))

        notificationListener.current = Notifications.addNotificationReceivedListener((data) => {
            console.log(JSON.stringify(data, null, 4))
            fetchNotification(data.request.content.data.id)
        })

        responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
            const notification = response.notification.request.content.data
            console.log(notification)
            if (notification && notification.target_route) {
                const routes = notification.target_route.split(",") as string[]
                console.log(routes)
                let timeout = 0
                routes.forEach((route) => {
                    setTimeout(() => navigation.navigate(route, notification.target_param), timeout)
                    timeout += 200
                })
                sendViewedNotification(notification.id)
            }
        })

        return () => {
            notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current)
            responseListener.current && Notifications.removeNotificationSubscription(responseListener.current)
        }
    }, [])

    useEffect(() => {
        if (expoPushToken && user) {
            saveExpoPushToken()
        }
    }, [expoPushToken, user])

    return null
}
