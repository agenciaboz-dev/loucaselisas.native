import { NavigationProp, RouteProp, useFocusEffect } from "@react-navigation/native"
import React, { useCallback, useState } from "react"
import { FlatList, LayoutAnimation, View } from "react-native"
import { Creator } from "../../../../types/server/class"
import { Lesson } from "../../../../types/server/class/Course/Lesson"
import { api } from "../../../../backend/api"
import { StatsCardContainer } from "./StatsCardContainer"

interface StatsLessonListProps {
    navigation: NavigationProp<any, any>
    route: RouteProp<any, any>
}

export const StatsLessonList: React.FC<StatsLessonListProps> = ({ navigation, route }) => {
    const creator = route.params?.creator as Creator | undefined

    const [lessons, setLessons] = useState<Lesson[]>([])
    const [refreshing, setRefreshing] = useState(true)

    const refresh = async () => {
        setRefreshing(true)
        try {
            const response = await api.get("/creator/lessons", { params: { creator_id: creator?.id } })
            // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
            setLessons(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setRefreshing(false)
        }
    }

    useFocusEffect(
        useCallback(() => {
            refresh()
        }, [])
    )

    return (
        <FlatList
            data={lessons.sort((a, b) => Number(b.published) - Number(a.published))}
            renderItem={({ item }) => (
                <StatsCardContainer
                    name={item.name}
                    image={item.thumb || ""}
                    likes={item.likes}
                    views={item.views}
                    downloads={item.downloads}
                    onPress={() => navigation.navigate("creator:lesson", { lesson: item })}
                    alt_text={item.course.name}
                />
            )}
            keyExtractor={(item) => item.id}
            refreshing={refreshing}
            onRefresh={refresh}
            style={{ margin: -20 }}
            contentContainerStyle={{ gap: 15, padding: 20, paddingBottom: 40 }}
        />
    )
}
