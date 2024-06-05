import React, { useEffect, useRef, useState } from "react"
import { Platform, View } from "react-native"
import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import Constants from "expo-constants"
import { Button, Text } from "react-native-paper"
import { useUser } from "../hooks/useUser"
import { api } from "../backend/api"

interface NotificationsHandlerProps {}

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
})

async function sendPushNotification(expoPushToken: string) {
    const message = {
        to: expoPushToken,
        sound: "default",
        title: "Original Title",
        body: "And here is the body!",
        data: { someData: "goes here" },
    }

    await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
    })
}

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
    const { user, setUser } = useUser()
    const [expoPushToken, setExpoPushToken] = useState("")
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined)
    const notificationListener = useRef<Notifications.Subscription>()
    const responseListener = useRef<Notifications.Subscription>()

    const saveExpoPushToken = async () => {
        if (!user || !expoPushToken) return
        if (user.expoPushToken == expoPushToken) return

        try {
            const response = await api.patch("/user", { id: user.id, expoPushToken })
            setUser(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        registerForPushNotificationsAsync()
            .then((token) => setExpoPushToken(token ?? ""))
            .catch((error: any) => setExpoPushToken(`${error}`))

        notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
            setNotification(notification)
        })

        responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
            console.log(response)
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
    // <View style={{ flex: 1, alignItems: "center", justifyContent: "space-around", position: "absolute", padding: 50 }}>
    //     <Text style={{ color: "white" }}>Your Expo push token: {expoPushToken}</Text>
    //     <View style={{ alignItems: "center", justifyContent: "center" }}>
    //         <Text style={{ color: "white" }}>Title: {notification && notification.request.content.title} </Text>
    //         <Text style={{ color: "white" }}>Body: {notification && notification.request.content.body}</Text>
    //         <Text style={{ color: "white" }}>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
    //     </View>
    //     <Button
    //         onPress={async () => {
    //             await sendPushNotification(expoPushToken)
    //         }}
    //     >
    //         Press to send push notification
    //     </Button>
    // </View>
}
