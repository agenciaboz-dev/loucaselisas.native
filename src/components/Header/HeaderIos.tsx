import React, { useState } from "react"
import { IconButton, Menu, Text, useTheme } from "react-native-paper"
import { useUser } from "../../hooks/useUser"
import { Pressable, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { NotificationItem } from "./NotificationItem"
import placeholders from "../../tools/placeholders"
import { TrianguloMiseravel } from "../TrianguloMiseravel"
import { Image } from "expo-image"

interface HeaderIosProps {}

export const HeaderIos: React.FC<HeaderIosProps> = ({}) => {
    const theme = useTheme()
    const navigation = useNavigation<any>()
    const { user } = useUser()

    const [showNotifications, setShowNotifications] = useState(false)

    return user ? (
        <View
            style={{
                backgroundColor: "white",
                flexDirection: "row",
                paddingTop: 35,
                paddingBottom: 15,
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                paddingHorizontal: 20,
                shadowColor: "gray", // Cor da sombra: preto para alto contraste
                shadowOffset: { width: 0, height: 0 }, // Deslocamento da sombra
                shadowOpacity: 0.4, // Opacidade da sombra
                shadowRadius: 3.84,
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
            {/* <Menu
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
            </Menu> */}
        </View>
    ) : null
}
