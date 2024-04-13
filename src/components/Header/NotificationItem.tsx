import React from "react"
import { View } from "react-native"
import { Avatar, IconButton, Menu, Surface, Text } from "react-native-paper"
import { avatar_placeholder } from "../../tools/avatar_placeholder"

interface NotificationItemProps {}

export const NotificationItem: React.FC<NotificationItemProps> = ({}) => {
    return (
        <View style={{ flex: 1, flexDirection: "row", gap: 30, paddingHorizontal: 15, paddingVertical: 5, alignItems: "center" }}>
            <Avatar.Image size={50} source={{ uri: avatar_placeholder }} />
            <View style={{ gap: 5, flex: 1 }}>
                <Text variant="bodyLarge" style={{ fontWeight: "bold" }}>
                    Nome do curso
                </Text>
                <Text numberOfLines={2}>
                    notificação notificação bla bla bla notificação notificação você pega o coco depois raspa o coco e joga na panela quente
                </Text>
            </View>
            <IconButton size={30} icon={"play"} style={{ margin: 0 }} onPress={() => console.log("notification action")} />
        </View>
    )
}
