import { NavigationProp, RouteProp, useFocusEffect } from "@react-navigation/native"
import React, { useCallback, useEffect, useState } from "react"
import { LayoutAnimation, RefreshControl, ScrollView, View } from "react-native"
import { ScreenTitle } from "../../components/ScreenTItle"
import { Course } from "../../types/server/class/Course"
import { CourseGallery } from "../../components/CourseGallery"
import { useTheme } from "react-native-paper"
import { ExtendableText } from "../../components/ExtendableText"
import { api } from "../../backend/api"
import { Lesson } from "../../types/server/class/Course/Lesson"
import { SceneMap, SceneRendererProps, TabBar, TabView } from "react-native-tab-view"
import { LessonsList } from "./LessonsList"
import { DownloadedList } from "./DownloadedList"

interface CourseProfileProps {
    navigation: NavigationProp<any, any>
    route: RouteProp<any, any>
}

export const CourseProfile: React.FC<CourseProfileProps> = ({ navigation, route }) => {
    const theme = useTheme()

    const [course, setCourse] = useState(route.params?.course as Course | undefined)

    const [lessons, setLessons] = useState<Lesson[]>([])
    const [loadingLessons, setLoadingLessons] = useState(true)

    const [tabIndex, setTabIndex] = useState(0)
    const [tabStates] = useState([
        { key: "lessons", title: "Lições" },
        { key: "downloaded", title: "Baixados" },
    ])

    const renderScene: React.FC<
        SceneRendererProps & {
            route: {
                key: string
                title: string
            }
        }
    > = ({ route }) => {
        switch (route.key) {
            case "lessons":
                return <LessonsList lessons={lessons} />
            case "downloaded":
                return <DownloadedList />
            default:
                return null
        }
    }

    const refreshCourse = async () => {
        setLoadingLessons(true)
        try {
            const response = await api.get("/course", { params: { course_id: course?.id } })
            setCourse(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const refreshLessons = async (timeout = 1000) => {
        setTimeout(async () => {
            try {
                const response = await api.get("/lesson", { params: { course_id: course?.id } })
                // TODO: ACTIVATE ON BUILD
                // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
                setLessons(response.data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoadingLessons(false)
            }
        }, timeout)
    }

    useEffect(() => {
        setTimeout(() => {
            // LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)

            // setSkeletons(skeletons_array)
            refreshLessons()
        }, 200)
    }, [course])

    useFocusEffect(
        useCallback(() => {
            refreshCourse()
        }, [])
    )

    return course ? (
        <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20, flex: 1 }}
            refreshControl={<RefreshControl refreshing={loadingLessons} onRefresh={refreshCourse} />}
        >
            <ScreenTitle title={course.name} />
            <CourseGallery course={course} />
            <ExtendableText minLines={3} text={course.description} />

            <TabView
                style={{ marginTop: 15, marginHorizontal: -20 }}
                navigationState={{ index: tabIndex, routes: tabStates }}
                onIndexChange={setTabIndex}
                renderScene={renderScene}
                renderTabBar={(props) => (
                    <TabBar
                        {...props}
                        style={{ backgroundColor: theme.colors.surface, elevation: 0, shadowOpacity: 0 }}
                        labelStyle={{ color: theme.colors.primary, textTransform: "none" }}
                        indicatorStyle={{
                            backgroundColor: "black",
                            borderRadius: 5,
                            height: 5,
                            width: 50,
                        }}
                        indicatorContainerStyle={{ marginHorizontal: "19%" }}
                    />
                )}
            />
        </ScrollView>
    ) : null
}
