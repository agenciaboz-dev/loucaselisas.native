import { NavigationProp } from "@react-navigation/native"
import React from "react"
import { View } from "react-native"
import { Text } from "react-native-paper"

interface DashboardProps {
    navigation: NavigationProp<any, any>
}

export const Dashboard: React.FC<DashboardProps> = ({ navigation }) => {
    return (
        <View style={{ flex: 1 }}>
            <Text>painel</Text>
        </View>
    )
}
