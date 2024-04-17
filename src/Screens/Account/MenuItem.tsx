import { useNavigation } from "@react-navigation/native"
import React from "react"
import { View } from "react-native"
import { Icon, Surface, Text, TouchableRipple } from "react-native-paper"

export interface MenuItemType {
    icon: string
    title: string
    route: string
}

export const MenuItem: React.FC<MenuItemType> = ({ icon, title, route }) => {
    const navigation = useNavigation<any>()

    const onPress = () => {
        navigation.navigate(route)
    }
    return (
        <Surface style={{ flexDirection: "row", borderRadius: 10 }}>
            <TouchableRipple
                borderless
                onPress={onPress}
                style={{ flex: 1, flexDirection: "row", gap: 5, padding: 5, alignItems: "center", borderRadius: 10 }}
            >
                <>
                    <Icon size={24} source={icon} />
                    <Text>{title}</Text>
                    <View style={{ marginLeft: "auto" }}>
                        <Icon size={24} source={"chevron-right"} />
                    </View>
                </>
            </TouchableRipple>
        </Surface>
    )
}
