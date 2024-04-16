import { NavigationProp } from "@react-navigation/native"
import React from "react"
import { View } from "react-native"
import { Text } from "react-native-paper"

interface FavoritesProps {
    navigation: NavigationProp<any, any>
}

export const Favorites: React.FC<FavoritesProps> = ({ navigation }) => {
    return (
        <View style={{ flex: 1 }}>
            <Text>favoritos</Text>
        </View>
    )
}
