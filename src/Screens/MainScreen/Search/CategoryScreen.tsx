import { NavigationProp, RouteProp, useFocusEffect } from "@react-navigation/native"
import React, { useCallback, useState } from "react"
import { LayoutAnimation, RefreshControl, ScrollView, View } from "react-native"
import { Category } from "../../../types/server/class/Category"
import { ScreenTitle } from "../../../components/ScreenTItle"
import { Course } from "../../../types/server/class/Course"
import { api } from "../../../backend/api"
import { CategoryCourseList } from "./CategoryCourseList"
import { useUser } from "../../../hooks/useUser"

interface CategoryScreenProps {
    navigation: NavigationProp<any, any>
    route: RouteProp<any, any>
}

export const CategoryScreen: React.FC<CategoryScreenProps> = ({ navigation, route }) => {
    const category = route.params?.category as Category | undefined
    const { user } = useUser()

    const [courses, setCourses] = useState<Course[]>([])
    const [refreshing, setRefreshing] = useState(true)

    const refresh = async () => {
        setCourses([])
        setRefreshing(true)
        try {
            const response = await api.get("/category/courses", { params: { category_id: category?.id, role_id: user?.role.id } })
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

    return category ? (
        <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20, gap: 10 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        >
            <ScreenTitle title={category.name} />
            <CategoryCourseList title={`Populares`} courses={[...courses].sort((a, b) => b.views - a.views).slice(0, 10)} loading={refreshing} />
            <CategoryCourseList title={`Favoritos`} courses={[...courses].sort((a, b) => b.likes - a.likes).slice(0, 10)} loading={refreshing} />
            {/* <CategoryCourseList
                title={`Gratuitos`}
                courses={[...courses]
                    .filter((item) => item.plans.find((plan) => plan.id == 1))
                    .sort((a, b) => Number(b.published) - Number(a.published))
                    .slice(0, 10)}
                loading={refreshing}
            /> */}
        </ScrollView>
    ) : null
}
