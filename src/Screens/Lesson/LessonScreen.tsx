import ImageView from "react-native-image-viewing"
import { NavigationProp, RouteProp, useFocusEffect } from "@react-navigation/native"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { Dimensions, FlatList, RefreshControl, ScrollView, Share, View } from "react-native"
import { Lesson } from "../../types/server/class/Course/Lesson"
import { useUser } from "../../hooks/useUser"
import { ScreenTitle } from "../../components/ScreenTItle"
import { api } from "../../backend/api"
import { IconButton, Menu, Surface, Text, TouchableRipple, useTheme } from "react-native-paper"
import { Course } from "../../types/server/class/Course"
import { TrianguloMiseravel } from "../../components/TrianguloMiseravel"
import { OptionsMenu } from "../../components/OptionsMenu/OptionsMenu"
import { Image, ImageStyle } from "expo-image"
import { ResizeMode, Video } from "expo-av"
import placeholders from "../../tools/placeholders"
import { ExtendableText } from "../../components/ExtendableText"
import { LesonSquareComponent } from "./LessonSquareComponent"
import { CourseSkeletons } from "../../components/CourseSkeletons"
import { CourseContainer } from "../Creator/CreatorHome/Resume/CourseContainer"
import { VideoPlayer } from "../../components/VideoPlayer/VideoPlayer"
import { useVideoPlayer } from "../../hooks/useVideoplayer"
import { AVPlaybackStatusSuccess } from "expo-av"
import { urlGenerator } from "../../tools/urlGenerator"
import { DisabledResource } from "../../components/DisabledResource"

interface LessonScreenProps {
    navigation: NavigationProp<any, any>
    route: RouteProp<any, any>
}

export const LessonScreen: React.FC<LessonScreenProps> = ({ navigation, route }) => {
    const { user } = useUser()
    const { isFullscreen, ref } = useVideoPlayer()
    const theme = useTheme()
    const image_width = Dimensions.get("screen").width * 0.9
    const max_image_height = (image_width / 16) * 9
    const media_style: ImageStyle = { width: image_width, height: max_image_height, borderRadius: 15 }
    const videoRef = useRef<Video>(null)
    const startingTime = route.params?.startingTime as number | undefined

    const [viewingMedia, setViewingMedia] = useState<number | null>(null)

    const [course, setCourse] = useState(route.params?.course as Course | undefined)
    const lesson_id = (route.params?.id as string | undefined) || (route.params?.lesson_id as string | undefined)
    const [lesson, setLesson] = useState(route.params?.lesson as Lesson | undefined)
    const [refreshing, setRefreshing] = useState(false)
    const [liking, setLiking] = useState(false)
    const liked = !!lesson?.favorited_by.find((item) => item.id == user?.id)
    const [showChatDenied, setShowChatDenied] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const [LessonsList, setLessonsList] = useState<Lesson[]>([])
    const [refreshingLessonsList, setRefreshingLessonsList] = useState(true)
    const [sameCategoryCourses, setSameCategoryCourses] = useState<Course[]>([])
    const [refreshingCourses, setRefreshingCourses] = useState(true)
    const [watchedTime, setWatchedTime] = useState<number>()

    const saveWatchedTime = async () => {
        try {
            const status = (await ref.current?.getStatusAsync()) as AVPlaybackStatusSuccess
            const watched = status.positionMillis
            const response = await api.post("/user/lesson_watchtime", { user_id: user?.id, lesson_id: lesson?.id, watched })
        } catch (error) {
            console.log(error)
        }
    }

    const fetchWatchedTime = async () => {
        try {
            const response = await api.get("/user/lesson_watchtime", { params: { user_id: user?.id, lesson_id: lesson?.id } })
            const data = response.data
            setWatchedTime(Number(data))
        } catch (error) {
            console.log(error)
        }
    }

    const fetchCategoryCourses = async () => {
        setRefreshingCourses(true)
        try {
            const response = await api.get("/course/categories", { params: { categories: course?.categories } })
            setSameCategoryCourses(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setRefreshingCourses(false)
        }
    }

    const fetchLessonsList = async () => {
        setRefreshingLessonsList(true)
        try {
            const response = await api.get("/lesson/course", { params: { course_id: course?.id } })
            setLessonsList(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setRefreshingLessonsList(false)
        }
    }

    const fetchCourse = async () => {
        console.log("a")
        if (!lesson) return

        try {
            const response = await api.get("/course", { params: { course_id: lesson.course_id } })
            setCourse(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const refreshLesson = async () => {
        setRefreshing(true)
        try {
            const response = await api.get("/lesson", { params: { lesson_id: lesson_id || lesson?.id, user_id: user?.id } })
            setLesson(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setRefreshing(false)
        }
    }

    const onLikePress = async () => {
        if (!user || !lesson) return
        setLiking(true)

        try {
            const data: { user_id: string; lesson_id: string; like?: boolean } = {
                lesson_id: lesson.id,
                user_id: user.id,
                like: !liked,
            }
            const response = await api.post("/lesson/favorite", data)
            const updated_lesson = response.data as Lesson
            setLesson(updated_lesson)
        } catch (error) {
            console.log(error)
        } finally {
            setLiking(false)
        }
    }

    const onChatPress = async () => {
        if (!course?.favorited_by.find((item) => item.id == user?.id)) {
            setShowChatDenied(true)
            setTimeout(() => setShowChatDenied(false), 3000)
            return
        }

        navigation.navigate("course:chat", { course })
    }

    const onShare = async () => {
        const url = urlGenerator.lesson(lesson?.id)
        await Share.share({ message: url, url, title: "Compartilhar Lição" })
        setShowMenu(false)
    }

    useEffect(() => {
        if (course) {
            fetchCategoryCourses()
            fetchLessonsList()
        }
    }, [course])

    useEffect(() => {
        if (lesson) fetchCourse()
    }, [lesson])

    useFocusEffect(
        useCallback(() => {
            refreshLesson()
            fetchWatchedTime()
            if (!course) {
                fetchCourse()
            }

            const interval = setInterval(() => saveWatchedTime(), 1000 * 3)

            return () => {
                videoRef.current?.stopAsync()
                clearInterval(interval)
            }
        }, [])
    )

    return lesson && course ? (
        lesson.status == "active" && course.status == "active" ? (
            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshLesson} enabled={!isFullscreen} />}
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 20, gap: 10 }}
                scrollEnabled={!isFullscreen}
            >
                {!isFullscreen && (
                    <>
                        <ScreenTitle
                            title={lesson.name}
                            right={
                                <View style={{ flexDirection: "row", gap: -5 }}>
                                    <IconButton
                                        icon={liked ? "heart" : "heart-outline"}
                                        style={{ margin: 0 }}
                                        loading={liking}
                                        onPress={onLikePress}
                                    />
                                    <Menu
                                        visible={showChatDenied}
                                        onDismiss={() => setShowChatDenied(false)}
                                        anchorPosition={"bottom"}
                                        anchor={<IconButton icon={"comment-text-outline"} style={{ margin: 0 }} onPress={onChatPress} />}
                                        contentStyle={[{ borderRadius: 15 }]}
                                        style={{ marginTop: 45 }}
                                    >
                                        <TrianguloMiseravel color={theme.colors.elevation.level3} right={10} />
                                        <View style={{ paddingHorizontal: 15 }}>
                                            <Text variant="bodyLarge">Favorite o curso para acessar o chat</Text>
                                        </View>
                                    </Menu>

                                    <OptionsMenu
                                        options={[{ label: "Compartilhar", onPress: onShare }]}
                                        Anchor={
                                            <IconButton icon={"dots-vertical"} style={{ margin: 0 }} onPress={() => setShowMenu((show) => !show)} />
                                        }
                                        onDismiss={() => setShowMenu(false)}
                                        visible={showMenu}
                                    />
                                </View>
                            }
                        />
                        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 2 }}>
                            <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                                {course.owner.nickname}
                            </Text>
                            <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                                {course.lessons} lições
                            </Text>
                        </View>
                    </>
                )}

                <Surface style={{ borderRadius: 15 }}>
                    {lesson.media.type == "image" ? (
                        <TouchableRipple borderless style={{ borderRadius: 15 }} onPress={() => setViewingMedia(0)}>
                            <Image
                                source={lesson.media.url}
                                transition={1000}
                                priority={"high"}
                                placeholder={placeholders.video}
                                placeholderContentFit="cover"
                                contentFit="cover"
                                style={media_style}
                            />
                        </TouchableRipple>
                    ) : (
                        <VideoPlayer source={lesson.media.url} course={course} lesson={lesson} initialPosition={startingTime || watchedTime} />
                    )}
                </Surface>
                {lesson.media.type == "image" && (
                    <ImageView
                        images={[{ uri: lesson.media.url }]}
                        imageIndex={viewingMedia ?? 0}
                        visible={viewingMedia !== null}
                        onRequestClose={() => setViewingMedia(null)}
                        animationType="slide"
                    />
                )}

                <ExtendableText minLines={3} text={lesson.info} />
                <Text variant="bodyLarge">Próximos</Text>
                <FlatList
                    horizontal
                    data={LessonsList.filter((item) => item.id != lesson.id).sort((a, b) => Number(a.published) - Number(b.published))}
                    renderItem={({ item }) => <LesonSquareComponent lesson={item} />}
                    style={{ margin: -20 }}
                    contentContainerStyle={{ padding: 20, gap: 10 }}
                    showsHorizontalScrollIndicator={false}
                    ListEmptyComponent={refreshingLessonsList ? <CourseSkeletons /> : <Text>Nenhuma lição a seguir</Text>}
                />
                <Text variant="bodyLarge">Veja também</Text>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={sameCategoryCourses.filter((item) => item.id != course.id)}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <CourseContainer course={item} route="course:profile" />}
                    style={{ margin: -20 }}
                    contentContainerStyle={{ gap: 10, padding: 20 }}
                    ListEmptyComponent={refreshingCourses ? <CourseSkeletons /> : <Text>Nenhum curso encontrado</Text>}
                />
            </ScrollView>
        ) : (
            <DisabledResource type="lesson" />
        )
    ) : null
}
