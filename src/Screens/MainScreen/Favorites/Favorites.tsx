import { NavigationProp } from "@react-navigation/native"
import React from "react"
import { Surface, Text } from "react-native-paper"

interface FavoritesProps {
    navigation: NavigationProp<any, any>
}

export const Favorites: React.FC<FavoritesProps> = ({ navigation }) => {
    return (
        <Surface style={{ flex: 1 }}>
            <Text>favoritos</Text>
        </Surface>
    )
}
