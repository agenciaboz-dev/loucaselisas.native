import { NavigationProp, RouteProp, useFocusEffect } from "@react-navigation/native"
import React, { useCallback, useState } from "react"
import { IconButton, Text, TouchableRipple, useTheme } from "react-native-paper"
import { Course } from "../../../types/server/class/Course"
import { ScreenTitle } from "../../../components/ScreenTItle"
import { FlatList, LayoutAnimation, Share, View } from "react-native"
import { currencyMask } from "../../../tools/currencyMask"
import { api } from "../../../backend/api"
import { MiniStatistics } from "./MiniStatistics"
import { Button } from "../../../components/Button"
import { Lesson } from "../../../types/server/class/Course/Lesson"
import { LessonContainer } from "./LessonContainer"
import { LessonsSkeletons } from "./LessonsSkeletons"
import { useArray } from "burgos-array"
import { OptionsMenu } from "../../../components/OptionsMenu/OptionsMenu"
import { CourseGallery } from "../../../components/CourseGallery"
import { StatusText } from "../../../components/StatusText"
import { DeclinedWarning } from "./DeclinedWarning"
import { urlGenerator } from "../../../tools/urlGenerator"

interface ManageCourseProps {
    navigation: NavigationProp<any, any>
    route: RouteProp<any, any>
}

export const ManageCourse: React.FC<ManageCourseProps> = ({ navigation, route }) => {
    const theme = useTheme()
    const course_id = route.params?.course_id as string | undefined

    const [showMenu, setShowMenu] = useState(false)
    const [course, setCourse] = useState(route.params?.course as Course | undefined)
    const [extendedDescription, setExtendedDescription] = useState(false)
    const [lessons, setLessons] = useState<Lesson[]>([])
    const [loadingLessons, setLoadingLessons] = useState(true)
    const [skeletons, setSkeletons] = useState<number[]>([])

    const skeletons_array = useArray().newArray(course?.lessons || 0)

    const onMenuItemPress = (route: string) => {
        setShowMenu(false)
        navigation.navigate(route, { course })
    }

    const refreshCourse = async () => {
        try {
            const response = await api.get("/course", { params: { course_id: course?.id || course_id } })
            setCourse(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const refreshLessons = async (timeout = 1000) => {
        setLoadingLessons(true)
        setTimeout(async () => {
            try {
                const response = await api.get("/lesson/course", { params: { course_id: course?.id } })
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

    const onDelete = () => {
        setShowMenu(false)
        navigation.navigate("creator:course:delete", { course })
    }

    const extendDescription = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setExtendedDescription((value) => !value)
    }

    const onShare = async () => {
        const url = urlGenerator.course(course?.id)
        await Share.share({ message: url, url, title: "Compartilhar curso" })
        setShowMenu(false)
    }

    useFocusEffect(
        useCallback(() => {
            setTimeout(() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
                setSkeletons(skeletons_array)
                refreshLessons()
            }, 200)
            refreshCourse()
        }, [])
    )

    return course ? (
        <View style={{ flex: 1, paddingHorizontal: 20, gap: 10 }}>
            <FlatList
                data={lessons.sort((a, b) => Number(b.published) - Number(a.published))}
                renderItem={({ item, index }) => (
                    <LessonContainer current_lesson={item} index={lessons.length - index - 1} refresh={refreshLessons} />
                )}
                keyExtractor={(item) => item.id}
                refreshing={loadingLessons}
                onRefresh={refreshLessons}
                style={{ marginHorizontal: -20, paddingTop: 10 }}
                contentContainerStyle={{ gap: 10, paddingBottom: 30, paddingHorizontal: 20 }}
                showsVerticalScrollIndicator
                ListEmptyComponent={
                    loadingLessons && course.lessons ? (
                        <>
                            {skeletons.map((index) => (
                                <LessonsSkeletons key={index} />
                            ))}
                        </>
                    ) : (
                        <Text>Nenhuma lição</Text>
                    )
                }
                ListHeaderComponent={
                    <>
                        <ScreenTitle
                            title={course.name}
                            right={
                                <View style={{ flexDirection: "row", gap: -10 }}>
                                    <IconButton
                                        icon={"comment-text-outline"}
                                        style={{ margin: 0 }}
                                        onPress={() => onMenuItemPress("creator:course:chat")}
                                    />
                                    <OptionsMenu
                                        options={[
                                            { label: "Editar curso", onPress: () => onMenuItemPress("creator:course:form") },
                                            { label: "Compartilhar", onPress: onShare },
                                            { label: "Chat", onPress: () => onMenuItemPress("creator:course:chat") },
                                            { label: "Deletar", onPress: onDelete },
                                        ]}
                                        Anchor={
                                            <IconButton icon={"dots-vertical"} style={{ margin: 0 }} onPress={() => setShowMenu((show) => !show)} />
                                        }
                                        onDismiss={() => setShowMenu(false)}
                                        visible={showMenu}
                                    />
                                </View>
                            }
                        />

                        {course.status == "declined" && <DeclinedWarning onEditPress={() => onMenuItemPress("creator:course:form")} />}
                        <CourseGallery course={course} />

                        <Text variant="bodyLarge">Valor: {currencyMask(course.price)}</Text>

                        <Text numberOfLines={!extendedDescription ? 2 : undefined}>{course.description}</Text>
                        <TouchableRipple onPress={extendDescription} style={{ alignSelf: "flex-end", marginTop: -5, marginBottom: 5 }}>
                            <Text style={{ textDecorationLine: "underline" }}>ler {extendedDescription ? "menos" : "mais"}...</Text>
                        </TouchableRipple>

                        <StatusText status={course.status} />
                        <MiniStatistics course={course} />
                        <Button
                            icon={"plus-circle"}
                            mode="outlined"
                            style={{ borderStyle: "dashed", marginTop: 10 }}
                            onPress={() => navigation.navigate("creator:lesson:form", { course })}
                        >
                            Nova lição
                        </Button>
                    </>
                }
            />
        </View>
    ) : null
}
