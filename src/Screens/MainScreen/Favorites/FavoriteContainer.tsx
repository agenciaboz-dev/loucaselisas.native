import React, { useState } from "react"
import { View } from "react-native"
import { Lesson } from "../../../types/server/class/Course/Lesson"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { useUser } from "../../../hooks/useUser"
import { api } from "../../../backend/api"
import { Course } from "../../../types/server/class/Course"
import { IconButton, Surface, Text, TouchableRipple, useTheme } from "react-native-paper"
import { Image } from "expo-image"

interface FavoriteContainerProps {
    lesson: Lesson
    course?: Course
    refresh: () => void
}

interface IconDataProps {
    text: string
    icon: string
    onPress: () => void
    loading?: boolean
}

export const IconData: React.FC<IconDataProps> = ({ text, icon, onPress, loading }) => (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text>{text}</Text>
        <IconButton icon={icon} onPress={onPress} style={{ margin: 0 }} loading={loading} />
    </View>
)

export const FavoriteContainer: React.FC<FavoriteContainerProps> = ({ lesson, course, refresh }) => {
    const { user } = useUser()

    const navigation = useNavigation<NavigationProp<any, any>>()
    const theme = useTheme()

    const [disliking, setDisliking] = useState(false)

    const onLikePress = async () => {
        if (!user) return
        setDisliking(true)

        try {
            const data: { user_id: string; lesson_id: string; like?: boolean } = {
                lesson_id: lesson.id,
                user_id: user.id,
                like: false,
            }
            const response = await api.post("/lesson/favorite", data)
            refresh()
            const updated_lesson = response.data as Lesson
        } catch (error) {
            console.log(error)
        }
    }

    const onChatPress = () => {
        navigation.navigate("chat", { course })
    }

    return (
        <Surface style={[{ backgroundColor: theme.colors.background, borderRadius: 15 }]}>
            <TouchableRipple
                borderless
                style={{ padding: 10, gap: 5, borderRadius: 15 }}
                onPress={() => navigation.navigate("lesson", { lesson, course })}
            >
                <>
                    <View style={{ flexDirection: "row", borderRadius: 15, gap: 5 }}>
                        <Image source={lesson.thumb} contentFit="cover" style={{ width: 100, aspectRatio: "1/1", borderRadius: 15 }} />
                        <View style={{ padding: 5, gap: 2, paddingRight: 110 }}>
                            <Text variant="bodyLarge">{lesson.name}</Text>
                            <Text numberOfLines={2}>{lesson.info}</Text>
                        </View>
                    </View>

                    <View style={{ borderColor: theme.colors.backdrop, borderTopWidth: 1, marginTop: 5 }} />

                    <View style={{ flexDirection: "row", marginLeft: "auto", alignSelf: "center", gap: 10 }}>
                        <IconData icon="heart" text="Favoritado" onPress={onLikePress} loading={disliking} />
                        {/* <IconData icon="download" text="Baixar" onPress={() => null} /> */}
                        <IconData icon="comment-text" text="Chat" onPress={onChatPress} />
                    </View>
                </>
            </TouchableRipple>
        </Surface>
    )
}
