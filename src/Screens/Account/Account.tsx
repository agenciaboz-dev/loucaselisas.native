import { NavigationProp } from "@react-navigation/native"
import React from "react"
import { TouchableOpacity } from "react-native"
import { Icon, Surface } from "react-native-paper"

interface AccountProps {
    navigation: NavigationProp<any, any>
}

export const Account: React.FC<AccountProps> = ({ navigation }) => {
    return <Surface style={{ flex: 1, padding: 20 }}></Surface>
}
