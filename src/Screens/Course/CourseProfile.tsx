import { NavigationProp, RouteProp, useFocusEffect } from "@react-navigation/native"
import React, { useCallback, useEffect, useState } from "react"
import { RefreshControl, ScrollView, View } from "react-native"
import { ScreenTitle } from "../../components/ScreenTItle"
import { Course } from "../../types/server/class/Course"
import { CourseGallery } from "../../components/CourseGallery"
import { IconButton, Menu, Text, useTheme } from "react-native-paper"
import { ExtendableText } from "../../components/ExtendableText"
import { api } from "../../backend/api"
import { Lesson } from "../../types/server/class/Course/Lesson"
import { SceneRendererProps, TabBar, TabView } from "react-native-tab-view"
import { LessonsList } from "./LessonsList"
import { DownloadedList } from "./DownloadedList"
import { useUser } from "../../hooks/useUser"
import { OptionsMenu } from "../../components/OptionsMenu/OptionsMenu"
import { TrianguloMiseravel } from "../../components/TrianguloMiseravel"

interface CourseProfileProps {
    navigation: NavigationProp<any, any>
    route: RouteProp<any, any>
}

export const CourseProfile: React.FC<CourseProfileProps> = ({ navigation, route }) => {
    const theme = useTheme()
    const { user } = useUser()

    const [course, setCourse] = useState(route.params?.course as Course | undefined)
    const is_favorited = course?.favorited_by?.find((item) => item.id == user?.id)

    const [lessons, setLessons] = useState<Lesson[]>([])
    const [loadingLessons, setLoadingLessons] = useState(true)
    const [favoriting, setFavoriting] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const [showChatDenied, setShowChatDenied] = useState(false)

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
                return <LessonsList lessons={lessons} quantity={course?.lessons || 0} refreshing={loadingLessons} />
            case "downloaded":
                return <DownloadedList />
            default:
                return null
        }
    }

    const refreshCourse = async () => {
        if (!user || !course) return
        setLoadingLessons(true)
        try {
            const response = await api.get("/course", { params: { course_id: course.id, user_id: user.id } })
            setCourse(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const refreshLessons = async (timeout = 1000) => {
        if (!course) return

        setTimeout(async () => {
            try {
                const response = await api.get("/lesson", { params: { course_id: course.id } })
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

    const onFavoritePress = async () => {
        if (!user || !course) return
        setFavoriting(true)
        try {
            const response = await api.post("/course/favorite", { user_id: user.id, course_id: course.id, like: !is_favorited })
            setCourse(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setFavoriting(false)
        }
    }

    const onChatPress = async () => {
        if (!is_favorited) {
            setShowChatDenied(true)
            setTimeout(() => setShowChatDenied(false), 3000)
            return
        }

        navigation.navigate("course:chat", { course })
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
            contentContainerStyle={{ padding: 20, paddingBottom: 0 }}
            refreshControl={<RefreshControl refreshing={loadingLessons} onRefresh={refreshCourse} />}
        >
            <ScreenTitle
                title={course.name}
                right={
                    <View style={{ flexDirection: "row", gap: -5 }}>
                        <IconButton
                            icon={is_favorited ? "heart" : "heart-outline"}
                            style={{ margin: 0 }}
                            loading={favoriting}
                            onPress={onFavoritePress}
                            iconColor={is_favorited && theme.colors.error}
                        />
                        <Menu
                            visible={showChatDenied}
                            onDismiss={() => setShowChatDenied(false)}
                            anchorPosition={"bottom"}
                            anchor={<IconButton icon={"comment-text-outline"} style={{ margin: 0 }} onPress={onChatPress} />}
                            contentStyle={[{ borderRadius: 15 }]}
                        >
                            <TrianguloMiseravel color={theme.colors.elevation.level3} right={10} />
                            <View style={{ paddingHorizontal: 15 }}>
                                <Text variant="bodyLarge">Favorite o curso para acessar o chat</Text>
                            </View>
                        </Menu>

                        <OptionsMenu
                            options={[{ label: "Editar curso", onPress: () => null }]}
                            Anchor={<IconButton icon={"dots-vertical"} style={{ margin: 0 }} onPress={() => setShowMenu((show) => !show)} />}
                            onDismiss={() => setShowMenu(false)}
                            visible={showMenu}
                        />
                    </View>
                }
            />
            <CourseGallery course={course} />
            <ExtendableText minLines={3} text={course.description} />

            <TabView
                style={{ marginTop: 15, marginHorizontal: -20, height: course.lessons * 200 || 90 }}
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
