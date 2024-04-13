import { NavigationProp } from "@react-navigation/native"
import React from "react"
import { Surface, Text } from "react-native-paper"

interface SearchProps {
    navigation: NavigationProp<any, any>
}

export const Search: React.FC<SearchProps> = ({ navigation }) => {
    return (
        <Surface style={{ flex: 1 }}>
            <Text>buscar</Text>
        </Surface>
    )
}
