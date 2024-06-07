import React, { useEffect, useState } from "react"
import { Badge, IconButton, Menu, Text, useTheme } from "react-native-paper"
import { useUser } from "../../hooks/useUser"
import { FlatList, Pressable, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { NotificationItem } from "./NotificationItem"
import placeholders from "../../tools/placeholders"
import { TrianguloMiseravel } from "../TrianguloMiseravel"
import { Image } from "expo-image"

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = ({}) => {
    const theme = useTheme()
    const navigation = useNavigation<any>()
    const { user, sendViewedNotification, refreshNotifications } = useUser()

    const [showNotifications, setShowNotifications] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => refreshNotifications(), 1000 * 60 * 1)

        return () => {
            clearInterval(interval)
        }
    }, [])

    return user ? (
        <View
            style={{
                // backgroundColor: theme.colors.background,
                flexDirection: "row",
                paddingVertical: 15,
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                paddingRight: 30,
            }}
        >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Pressable onPress={() => navigation.navigate("setup")}>
                    <Image
                        source={user.image}
                        placeholder={placeholders.avatar}
                        contentFit="cover"
                        style={{ width: 50, aspectRatio: "1/1", borderRadius: 100 }}
                    />
                </Pressable>
                <Text variant="titleLarge">{user.name}</Text>
            </View>
            <Menu
                visible={showNotifications}
                onDismiss={() => setShowNotifications(false)}
                anchorPosition="bottom"
                anchor={
                    <View style={{ position: "relative" }}>
                        <IconButton icon={"bell-outline"} onPress={() => setShowNotifications(true)} />
                        {!!user.notifications.filter((item) => !item.viewed).length && (
                            <Badge style={{ position: "absolute" }}>{user.notifications.filter((item) => !item.viewed).length}</Badge>
                        )}
                    </View>
                }
                contentStyle={{ width: "100%" }}
                style={{ width: "93%", marginTop: 40 }}
            >
                <TrianguloMiseravel />
                <FlatList
                    data={user.notifications.sort((a, b) => Number(b.datetime) - Number(a.datetime))}
                    renderItem={({ item }) => (
                        <NotificationItem
                            notification={item}
                            closeModal={() => setShowNotifications(false)}
                            sendViewedNotification={sendViewedNotification}
                        />
                    )}
                    keyExtractor={(item) => item.id}
                    style={{ height: 500, margin: -10 }}
                    contentContainerStyle={{ padding: 10 }}
                />
            </Menu>
        </View>
    ) : null
}
