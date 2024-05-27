import { NavigationProp, useFocusEffect } from "@react-navigation/native"
import React, { useCallback, useRef, useState } from "react"
import { LayoutAnimation, RefreshControl, ScrollView, View } from "react-native"
import { Course } from "../../../types/server/class/Course"
import { FilteredCourses } from "./FilteredCourses"
import { api } from "../../../backend/api"
import { Text } from "react-native-paper"
import { CourseList } from "./CourseList"
import { useUser } from "../../../hooks/useUser"

interface DashboardProps {
    navigation: NavigationProp<any, any>
}

export const Dashboard: React.FC<DashboardProps> = ({ navigation }) => {
    const scrollRef = useRef<ScrollView>(null)
    const { user } = useUser()

    const [courses, setCourses] = useState<Course[]>([])
    const [refreshing, setRefreshing] = useState(true)

    const refreshCourses = async () => {
        if (!user) return

        setRefreshing(true)
        try {
            const response = await api.get("/course/search", { params: { user_id: user.id, text: "" } })
            // TODO: ACTIVATE ON BUILD
            // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
            setCourses(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setRefreshing(false)
        }
    }

    useFocusEffect(
        useCallback(() => {
            refreshCourses()
        }, [])
    )

    return (
        <ScrollView
            ref={scrollRef}
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20, gap: 10 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshCourses} />}
        >
            <FilteredCourses courses={courses}  />
            <Text variant="titleLarge">Explorar</Text>
            <CourseList courses={courses} scrollRef={scrollRef} refreshing={refreshing} />
        </ScrollView>
    )
}
