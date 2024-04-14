import { useNavigation } from "@react-navigation/native"
import React from "react"
import { View } from "react-native"
import { IconButton, Surface, Text } from "react-native-paper"

interface ScreenTitleProps {
    title: string
    hideBackArrow?: boolean
}

export const ScreenTitle: React.FC<ScreenTitleProps> = ({ title, hideBackArrow }) => {
    const navigation = useNavigation<any>()
    return (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <IconButton icon={"chevron-left"} onPress={() => navigation.goBack()} style={{ margin: 0 }} />
            <Text variant="titleLarge" style={{ alignSelf: "center" }}>
                Editar perfil
            </Text>
        </View>
    )
}
