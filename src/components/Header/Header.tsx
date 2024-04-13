import React, { useState } from "react"
import { Avatar, IconButton, Menu, Surface, Text, useTheme } from "react-native-paper"
import { useUser } from "../../hooks/useUser"
import { Pressable, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { colors } from "../../style/colors"
import { avatar_placeholder } from "../../tools/placeholders"
import { NotificationItem } from "./NotificationItem"

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = ({}) => {
    const navigation = useNavigation<any>()
    const { user } = useUser()
    const theme = useTheme()

    const [showNotifications, setShowNotifications] = useState(false)

    // const menu_item_style =

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
                    <Avatar.Image size={50} source={{ uri: user.image || avatar_placeholder }} />
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
                {/* triangulo miseravel */}
                <View
                    style={{
                        borderTopWidth: 0,
                        width: 0,
                        height: 0,
                        position: "absolute",
                        right: 15,
                        top: -11,
                        borderBottomColor: theme.colors.elevation.level2,
                        borderLeftColor: "transparent",
                        borderRightColor: "transparent",
                        borderBottomWidth: 10,
                        borderRightWidth: 10,
                        borderLeftWidth: 10,
                    }}
                ></View>
                <NotificationItem />
                <NotificationItem />
                <NotificationItem />
            </Menu>
        </View>
    ) : null
}
