import { NavigationProp, RouteProp, useFocusEffect } from "@react-navigation/native"
import React, { useCallback, useState } from "react"
import { Keyboard, LayoutAnimation, RefreshControl, ScrollView, View } from "react-native"
import { ScreenTitle } from "../../../components/ScreenTItle"
import { api } from "../../../backend/api"
import { Course } from "../../../types/server/class/Course"
import { CategoryCourseList } from "./CategoryCourseList"
import { TextInput, useTheme } from "react-native-paper"
import { useUser } from "../../../hooks/useUser"

interface SearchCoursesScreenProps {
    navigation: NavigationProp<any, any>
    route: RouteProp<any, any>
}

export const SearchCoursesScreen: React.FC<SearchCoursesScreenProps> = ({ navigation, route }) => {
    const theme = useTheme()
    const { user } = useUser()

    const [searchText, setSearchText] = useState(route.params?.text as string | undefined)
    const [loading, setLoading] = useState(true)
    const [courses, setCourses] = useState<Course[]>([])

    const fetchResult = async () => {
        if (!searchText) return

        Keyboard.dismiss()
        setLoading(true)
        try {
            const response = await api.get("/course/search", { params: { text: searchText, user_id: user?.id } })
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
            setCourses(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchResult()
        }, [])
    )

    return (
        <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20, gap: 10 }}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchResult} />}
        >
            <ScreenTitle title="Pesquisar Cursos" />
            <TextInput
                placeholder={"Pesquisar Cursos"}
                mode="outlined"
                value={searchText}
                onChangeText={setSearchText}
                style={{ backgroundColor: theme.colors.surfaceDisabled, marginTop: 10 }}
                outlineStyle={{ borderRadius: 100, borderWidth: 0 }}
                left={<TextInput.Icon icon={"menu"} />}
                right={<TextInput.Icon icon="magnify" onPress={fetchResult} />}
                onSubmitEditing={fetchResult}
            />
            <CategoryCourseList title="Populares" courses={[...courses].sort((a, b) => b.views - a.views)} loading={loading} />
            <CategoryCourseList title="Favoritos" courses={[...courses].sort((a, b) => b.likes - a.likes)} loading={loading} />
            {/* <CategoryCourseList
                title="Gratuitos"
                courses={[...courses].filter((item) => item.plans.find((plan) => plan.id == 1)).sort((a, b) => b.views - a.views)}
                loading={loading}
            /> */}
        </ScrollView>
    )
}
