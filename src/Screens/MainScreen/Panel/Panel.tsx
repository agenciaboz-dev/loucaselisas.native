import { NavigationProp } from "@react-navigation/native"
import React from "react"
import { Surface, Text } from "react-native-paper"

interface PanelProps {
    navigation: NavigationProp<any, any>
}

export const Panel: React.FC<PanelProps> = ({ navigation }) => {
    return (
        <Surface style={{ flex: 1 }}>
            <Text>painel</Text>
        </Surface>
    )
}
