import React from "react"
import { View } from "react-native"
import { Avatar, Badge, IconButton, Text, TouchableRipple, useTheme } from "react-native-paper"
import placeholders from "../../tools/placeholders"
import { Notification } from "../../types/server/class/Notification"
import { NavigationProp, useNavigation } from "@react-navigation/native"

interface NotificationItemProps {
    notification: Notification
    closeModal: () => void
    sendViewedNotification: (notification_id: string) => Promise<void>
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, closeModal, sendViewedNotification }) => {
    const theme = useTheme()
    const navigation = useNavigation<NavigationProp<any, any>>()
    const datetime = new Date(Number(notification.datetime))

    const onPress = () => {
        closeModal()
        sendViewedNotification(notification.id)
        const routes = notification.target_route.split(",")
        console.log(routes)
        let timeout = 0
        routes.forEach((route) => {
            setTimeout(() => navigation.navigate(route, notification.target_param), timeout)
            timeout += 200
        })
    }

    return (
        <TouchableRipple
            borderless
            style={[
                { flex: 1, flexDirection: "row", gap: 30, paddingHorizontal: 15, paddingVertical: 5, alignItems: "center", position: "relative" },
                // notification.viewed && { backgroundColor: theme.colors.background },
            ]}
            onPress={onPress}
        >
            <>
                {!notification.viewed && <Badge size={15} style={{ position: "absolute", top: 5, left: 60 }} />}
                <Avatar.Image size={50} source={notification.image ? { uri: notification.image } : placeholders.avatar} />
                <View style={{ gap: 5, flex: 1 }}>
                    <Text variant="bodyLarge" style={{ fontWeight: notification.viewed ? "normal" : "bold" }}>
                        {notification.title}
                    </Text>
                    <Text numberOfLines={2}>{notification.body}</Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.backdrop }}>
                        {datetime.toLocaleTimeString("pt-br", { hour: "2-digit", minute: "2-digit" })} - {datetime.toLocaleDateString("pt-br")}
                    </Text>
                </View>
                {!notification.viewed && (
                    <IconButton size={30} icon={"check"} style={{ margin: 0 }} onPress={() => sendViewedNotification(notification.id)} />
                )}
            </>
        </TouchableRipple>
    )
}
