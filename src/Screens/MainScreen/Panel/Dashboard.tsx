import { NavigationProp, useFocusEffect } from "@react-navigation/native"
import React, { useCallback, useState } from "react"
import { LayoutAnimation, ScrollView, View } from "react-native"
import { Course } from "../../../types/server/class/Course"
import { FilteredCourses } from "./FilteredCourses"
import { api } from "../../../backend/api"

interface DashboardProps {
    navigation: NavigationProp<any, any>
}

export const Dashboard: React.FC<DashboardProps> = ({ navigation }) => {
    const [courses, setCourses] = useState<Course[]>([])
    const [refreshing, setRefreshing] = useState(true)

    const refreshCourses = async () => {
        setRefreshing(true)
        try {
            const response = await api.get("/course/all")
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
            refreshCourses()
        }, [])
    )

    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, gap: 10 }}>
            <FilteredCourses courses={courses} refreshing={refreshing} />
        </ScrollView>
    )
}
