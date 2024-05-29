import React, { useEffect, useState } from "react"
import { View } from "react-native"
import { Lesson } from "../../types/server/class/Course/Lesson"
import { IconButton, Surface, Text, TouchableRipple, useTheme } from "react-native-paper"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { Image } from "expo-image"
import { useUser } from "../../hooks/useUser"
import { api } from "../../backend/api"
import { Course } from "../../types/server/class/Course"

interface LessonContainerProps {
    lesson: Lesson
    index: number
    course?: Course
    liked_variant?: boolean
    blocked?: boolean
    refreshCourse: () => Promise<void>
}

export const LessonContainer: React.FC<LessonContainerProps> = ({ lesson, index, course, liked_variant, blocked, refreshCourse }) => {
    const { user } = useUser()

    const navigation = useNavigation<NavigationProp<any, any>>()
    const theme = useTheme()

    const [liking, setLiking] = useState(false)
    const [liked, setliked] = useState(!!lesson?.favorited_by.find((item) => item.id == user?.id))

    const onLikePress = async () => {
        if (!user) return
        setLiking(true)

        try {
            const data: { user_id: string; lesson_id: string; like?: boolean } = {
                lesson_id: lesson.id,
                user_id: user.id,
                like: !liked,
            }
            const response = await api.post("/lesson/favorite", data)
            const updated_lesson = response.data as Lesson
            setliked(!!updated_lesson.favorited_by.find((item) => item.id == user.id))
            await refreshCourse()
        } catch (error) {
            console.log(error)
        } finally {
            setLiking(false)
        }
    }

    const onChatPress = () => {
        navigation.navigate("chat", { course })
    }

    useEffect(() => {
        setliked(!!lesson?.favorited_by.find((item) => item.id == user?.id))
    }, [lesson])

    return user ? (
        <Surface style={[{ backgroundColor: theme.colors.background, borderRadius: 15 }, blocked && { opacity: 0.5, pointerEvents: "none" }]}>
            <TouchableRipple
                borderless
                style={{ flexDirection: "row", borderRadius: 15, padding: 5, gap: 5 }}
                onPress={() => navigation.navigate("lesson", { lesson, course })}
            >
                <>
                    <Image source={lesson.thumb} contentFit="cover" style={{ width: 100, aspectRatio: "1/1", borderRadius: 15 }} />
                    <View style={{ padding: 5, gap: 2, paddingRight: 140 }}>
                        {!liked_variant && (
                            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceDisabled }}>
                                Lição {index}
                            </Text>
                        )}
                        <Text variant="bodyLarge">{lesson.name}</Text>
                        <Text numberOfLines={2}>{lesson.info}</Text>
                        {liked_variant && (
                            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceDisabled, marginTop: "auto" }}>
                                {course?.name}
                            </Text>
                        )}
                    </View>
                    <View style={{ marginLeft: "auto", alignSelf: "center" }}>
                        {liked_variant ? (
                            <IconButton icon={"comment-text-outline"} onPress={onChatPress} />
                        ) : (
                            <IconButton loading={liking} icon={liked ? "heart" : "heart-outline"} onPress={onLikePress} />
                        )}
                        {/* <OptionsMenu  /> */}
                    </View>
                </>
            </TouchableRipple>
        </Surface>
    ) : null
}
