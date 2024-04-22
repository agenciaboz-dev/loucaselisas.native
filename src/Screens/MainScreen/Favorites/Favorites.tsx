import { NavigationProp } from "@react-navigation/native"
import React, { useState } from "react"
import { View } from "react-native"
import { Text } from "react-native-paper"
import { ScreenTitle } from "../../../components/ScreenTItle"
import { Lesson } from "../../../types/server/class/Course/Lesson"

interface FavoritesProps {
    navigation: NavigationProp<any, any>
}

export const Favorites: React.FC<FavoritesProps> = ({ navigation }) => {
    const [lessons, setLessons] = useState<Lesson[]>([])
    const [filteredLessons, setFilteredLessons] = useState(lessons)
    const [refreshing, setRefreshing] = useState(true)

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <ScreenTitle title="Seus Favoritos" hideBackArrow />
        </View>
    )
}
