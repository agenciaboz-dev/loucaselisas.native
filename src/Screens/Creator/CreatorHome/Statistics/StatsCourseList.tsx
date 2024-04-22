import React, { useCallback, useState } from "react"
import { FlatList, LayoutAnimation, View } from "react-native"
import { Course } from "../../../../types/server/class/Course"
import { NavigationProp, RouteProp, useFocusEffect } from "@react-navigation/native"
import { Text } from "react-native-paper"
import { api } from "../../../../backend/api"
import { Creator } from "../../../../types/server/class"
import { CourseStatsContainer } from "./CourseStatsContainer"

interface StatsCourseListProps {
    navigation: NavigationProp<any, any>
    route: RouteProp<any, any>
}

export const StatsCourseList: React.FC<StatsCourseListProps> = ({ navigation, route }) => {
    const creator = route.params?.creator as Creator | undefined

    const [courses, setCourses] = useState<Course[]>([])
    const [refreshing, setRefreshing] = useState(true)

    const refresh = async () => {
        setRefreshing(true)
        try {
            const response = await api.get("/course/owner", { params: { owner_id: creator?.id } })
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
            setCourses(response.data)
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
            data={courses}
            renderItem={({ item }) => <CourseStatsContainer course={item} />}
            keyExtractor={(item) => item.id}
            refreshing={refreshing}
            onRefresh={refresh}
            style={{ margin: -20 }}
            contentContainerStyle={{ gap: 15, padding: 20, paddingBottom: 40 }}
        />
    )
}
