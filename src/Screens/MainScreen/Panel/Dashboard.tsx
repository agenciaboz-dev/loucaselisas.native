import { NavigationProp } from "@react-navigation/native"
import React from "react"
import { Surface, Text } from "react-native-paper"

interface DashboardProps {
    navigation: NavigationProp<any, any>
}

export const Dashboard: React.FC<DashboardProps> = ({ navigation }) => {
    return (
        <Surface style={{ flex: 1 }}>
            <Text>painel</Text>
        </Surface>
    )
}
