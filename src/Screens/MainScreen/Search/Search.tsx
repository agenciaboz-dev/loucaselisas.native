import { NavigationProp } from "@react-navigation/native"
import React from "react"
import { View } from "react-native"
import { Text } from "react-native-paper"

interface SearchProps {
    navigation: NavigationProp<any, any>
}

export const Search: React.FC<SearchProps> = ({ navigation }) => {
    return (
        <View style={{ flex: 1 }}>
            <Text>buscar</Text>
        </View>
    )
}
