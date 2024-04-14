import { NavigationProp } from "@react-navigation/native"
import React from "react"
import { View } from "react-native"

interface CreatorStackProps {
    navigation: NavigationProp<any, any>
}

export const CreatorStack: React.FC<CreatorStackProps> = ({ navigation }) => {
    return <View style={{ flex: 1, backgroundColor: "red" }}></View>
}
