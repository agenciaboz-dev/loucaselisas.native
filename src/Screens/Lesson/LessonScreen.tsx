import ImageView from "react-native-image-viewing"
import { NavigationProp, RouteProp, useFocusEffect } from "@react-navigation/native"
import React, { useCallback, useState } from "react"
import { Dimensions, RefreshControl, ScrollView, View } from "react-native"
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

interface LessonScreenProps {
    navigation: NavigationProp<any, any>
    route: RouteProp<any, any>
}

export const LessonScreen: React.FC<LessonScreenProps> = ({ navigation, route }) => {
    const { user } = useUser()
    const course = route.params?.course as Course | undefined
    const theme = useTheme()
    const image_width = Dimensions.get("screen").width * 0.9
    const max_image_height = (image_width / 16) * 9
    const media_style: ImageStyle = { width: image_width, height: max_image_height, borderRadius: 15 }

    const [viewingMedia, setViewingMedia] = useState<number | null>(null)

    const [lesson, setLesson] = useState(route.params?.lesson as Lesson | undefined)
    const [refreshing, setRefreshing] = useState(false)
    const [liking, setLiking] = useState(false)
    const liked = !!lesson?.favorited_by.find((item) => item.id == user?.id)
    const [showChatDenied, setShowChatDenied] = useState(false)
    const [showMenu, setShowMenu] = useState(false)

    const refreshLesson = async () => {
        setRefreshing(true)
        try {
            const response = await api.get("/lesson", { params: { lesson_id: lesson?.id } })
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

    useFocusEffect(
        useCallback(() => {
            refreshLesson()
        }, [])
    )

    return lesson && course ? (
        <ScrollView
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshLesson} />}
            style={{ flex: 1 }}
            contentContainerStyle={{ flex: 1, padding: 20, gap: 10 }}
        >
            <ScreenTitle
                title={lesson.name}
                right={
                    <View style={{ flexDirection: "row", gap: -5 }}>
                        <IconButton icon={liked ? "heart" : "heart-outline"} style={{ margin: 0 }} loading={liking} onPress={onLikePress} />
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
                            options={[{ label: "Compartilhar", onPress: () => null }]}
                            Anchor={<IconButton icon={"dots-vertical"} style={{ margin: 0 }} onPress={() => setShowMenu((show) => !show)} />}
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

            <Surface style={{ borderRadius: 15 }}>
                {lesson.media.type == "IMAGE" ? (
                    <TouchableRipple borderless style={{ borderRadius: 15 }} onPress={() => setViewingMedia(0)}>
                        <Image
                            source={lesson.media.url}
                            transition={1000}
                            priority={"high"}
                            placeholder={placeholders.video}
                            contentFit="cover"
                            style={media_style}
                        />
                    </TouchableRipple>
                ) : (
                    <Video
                        source={{ uri: lesson.media.url }}
                        resizeMode={ResizeMode.COVER}
                        style={media_style}
                        useNativeControls
                        shouldPlay
                        onError={(error) => console.log(`course cover error: ${error}`)}
                    />
                )}
            </Surface>
            {lesson.media.type == "IMAGE" && (
                <ImageView
                    images={[{ uri: lesson.media.url }]}
                    imageIndex={viewingMedia ?? 0}
                    visible={viewingMedia !== null}
                    onRequestClose={() => setViewingMedia(null)}
                    animationType="slide"
                />
            )}

            <ExtendableText minLines={3} text={lesson.info} />
        </ScrollView>
    ) : null
}
