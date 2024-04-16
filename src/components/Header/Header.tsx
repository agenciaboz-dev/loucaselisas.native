import React, { useState } from "react"
import { Avatar, IconButton, Menu, Text } from "react-native-paper"
import { useUser } from "../../hooks/useUser"
import { Pressable, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { NotificationItem } from "./NotificationItem"
import placeholders from "../../tools/placeholders"
import { TrianguloMiseravel } from "../TrianguloMiseravel"

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = ({}) => {
    const navigation = useNavigation<any>()
    const { user } = useUser()

    const [showNotifications, setShowNotifications] = useState(false)

    return user ? (
        <View
            style={{
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
                    <Avatar.Image size={50} source={user.image ? { uri: user.image } : placeholders.avatar} />
                </Pressable>
                <Text variant="titleLarge">{user.name}</Text>
            </View>
            <Menu
                visible={showNotifications}
                onDismiss={() => setShowNotifications(false)}
                anchorPosition="bottom"
                anchor={<IconButton icon={"bell-outline"} onPress={() => setShowNotifications(true)} />}
                contentStyle={{ width: "100%" }}
                style={{ width: "93%" }}
            >
                <TrianguloMiseravel />
                <NotificationItem />
                <NotificationItem />
                <NotificationItem />
            </Menu>
        </View>
    ) : null
}
