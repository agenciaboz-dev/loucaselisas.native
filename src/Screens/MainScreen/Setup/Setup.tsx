import { NavigationProp } from "@react-navigation/native"
import React from "react"
import { Surface, Text } from "react-native-paper"

interface SetupProps {
    navigation: NavigationProp<any, any>
}

export const Setup: React.FC<SetupProps> = ({ navigation }) => {
    return (
        <Surface style={{ flex: 1 }}>
            <Text>config</Text>
        </Surface>
    )
}
