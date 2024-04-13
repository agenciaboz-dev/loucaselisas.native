import React from "react"
import { Avatar, Surface, Text } from "react-native-paper"
import { useUser } from "../../hooks/useUser"
import { Pressable, View } from "react-native"
import { useNavigation } from "@react-navigation/native"

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = ({}) => {
    const navigation = useNavigation<any>()
    const { user } = useUser()
    console.log(user)

    return user ? (
        <View style={{ flexDirection: "row", paddingVertical: 15, alignItems: "center", gap: 10 }}>
            <Pressable onPress={() => navigation.navigate("setup")}>
                <Avatar.Image size={50} source={{ uri: user.image || undefined }} />
            </Pressable>
            <Text variant="titleLarge">{user.name}</Text>
        </View>
    ) : null
}
