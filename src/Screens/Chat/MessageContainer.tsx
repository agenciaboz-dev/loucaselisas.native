import React, { useEffect, useState } from "react"
import { LayoutAnimation, Pressable, View } from "react-native"
import { Message } from "../../types/server/class/Chat/Message"
import { Checkbox, Surface, Text, TouchableRipple, useTheme } from "react-native-paper"
import { useUser } from "../../hooks/useUser"
import { Creator } from "../../types/server/class"
import SkeletonPlaceholder from "react-native-skeleton-placeholder"
import { Image } from "expo-image"
import { Lesson } from "../../types/server/class/Course/Lesson"
import { api } from "../../backend/api"
import * as VideoThumbnails from "expo-video-thumbnails"
import moment from "moment"
import "moment-duration-format"
import { NavigationProp, useNavigation } from "@react-navigation/native"

interface MessageContainerProps {
    message: Message
    list: Message[]
    creators: Partial<Creator>[]
    refreshing?: boolean
    showImage: (position: number) => void
    onSelectMessage: (message: Message, selected: boolean) => void
    selectedList: Message[]
}

export const MessageContainer: React.FC<MessageContainerProps> = ({
    message,
    list,
    creators,
    refreshing,
    showImage,
    onSelectMessage,
    selectedList,
}) => {
    const navigation = useNavigation<any>()
    const { user } = useUser()
    const you = message.user_id == user?.id
    const theme = useTheme()
    const skeletonWidth = message.media || message.video_id ? 480 : message.text.length * 14 * 0.55 + 20
    const skeletonHeight = message.media
        ? (270 * message.media.height) / message.media.width
        : message.video_id
        ? 115
        : (Math.floor(skeletonWidth / 300) + 1) * 30

    const index = list.findIndex((item) => item.id == message.id)
    const next_message = index > 0 ? list[index - 1] : null
    const previous_message = index + 1 <= list.length ? list[index + 1] : null

    const same_message_above = !(!previous_message || previous_message.user_id != message.user_id)
    const same_message_bellow = !(!next_message || next_message.user_id != message.user_id)

    const [lesson, setLesson] = useState<Lesson>()
    const [thumb, setThumb] = useState("")
    const [loadingLesson, setLoadingLesson] = useState(!!message.video_id)
    const [selected, setSelected] = useState(false)

    const fetchLesson = async () => {
        try {
            setLoadingLesson(true)
            const response = await api.get("/lesson", { params: { lesson_id: message.video_id } })
            setLesson(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchThumb = async (lesson: Lesson) => {
        const { uri } = await VideoThumbnails.getThumbnailAsync(lesson.media.url, { time: Number(message.video_timestamp) })
        setThumb(uri)
        setLoadingLesson(false)
    }

    const onVideoMessagePress = async () => {
        navigation.push("lesson", { lesson, startingTime: Number(message.video_timestamp) })
    }

    const handlePress = () => {
        if (!!selectedList.length) {
            // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
            setSelected(!selected)
        }
    }

    const handleLongPress = () => {
        if (!selected) {
            // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
            setSelected(true)
        }
    }

    useEffect(() => {
        // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        onSelectMessage(message, selected)
    }, [selected])

    useEffect(() => {
        if (lesson) {
            fetchThumb(lesson)
        }
    }, [lesson])

    useEffect(() => {
        if (message.video_id) {
            fetchLesson()
        }
    }, [])

    return user ? (
        !refreshing && !loadingLesson ? (
            <Pressable
                onLongPress={handleLongPress}
                style={[
                    { alignSelf: "flex-start", alignItems: "flex-start" },
                    you && { alignSelf: "flex-end", alignItems: "flex-end" },
                    same_message_above && { marginTop: -12 },
                ]}
                onPress={handlePress}
            >
                {!same_message_above && (
                    <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 0, marginBottom: 5 }}>
                        {!!creators.find((item) => item.user_id == message.user_id) && (
                            <Image source={require("../../../assets/logo_without_text.svg")} style={{ width: 20, height: 20 }} tintColor={"black"} />
                        )}
                        <Text variant="bodySmall" style={{ paddingHorizontal: 5 }}>
                            {you ? "Você" : message.user?.name || "Usuário indisponível"}
                        </Text>
                    </View>
                )}
                <View
                    style={[
                        { alignItems: "center", flexDirection: "row", gap: 20 },
                        selected && { backgroundColor: "#00000033", borderRadius: 15, marginRight: -20, paddingRight: 20 },
                    ]}
                >
                    <Surface
                        style={[
                            { padding: 10, borderRadius: 15, maxWidth: 300, gap: 10 },
                            you && { backgroundColor: theme.colors.surfaceVariant },
                            you && !same_message_bellow && { borderBottomRightRadius: 0 },
                            !you && !same_message_bellow && { borderBottomLeftRadius: 0, alignSelf: "flex-start" },
                        ]}
                    >
                        {message.media && (
                            <TouchableRipple
                                borderless
                                style={{ borderRadius: 10 }}
                                pointerEvents={!!selectedList.length ? "none" : "auto"}
                                onPress={() => showImage(message.media!.position)}
                                onLongPress={handleLongPress}
                            >
                                <Image
                                    source={{ uri: message.media.url }}
                                    style={{ width: 270, aspectRatio: message.media.width / message.media.height, maxHeight: 500, borderRadius: 10 }}
                                />
                            </TouchableRipple>
                        )}
                        {lesson && thumb && (
                            <TouchableRipple
                                borderless
                                style={{ borderRadius: 10 }}
                                pointerEvents={!!selectedList.length ? "none" : "auto"}
                                onPress={onVideoMessagePress}
                                onLongPress={handleLongPress}
                            >
                                <Surface elevation={3} style={{ padding: 5, width: 270, flexDirection: "row", gap: 10 }}>
                                    <Image source={{ uri: thumb }} style={{ width: 70, aspectRatio: 1, borderRadius: 10 }} />
                                    <View style={{ justifyContent: "space-evenly" }}>
                                        <Text variant="bodyLarge" numberOfLines={1}>
                                            {lesson.name}
                                        </Text>
                                        <Text>
                                            {/* @ts-ignore */}
                                            {moment.duration(message.video_timestamp).format("mm:ss", { trim: false })}
                                        </Text>
                                    </View>
                                </Surface>
                            </TouchableRipple>
                        )}
                        {message.text && <Text>{message.text}</Text>}
                    </Surface>
                    {!!selectedList.length && you && (
                        <View style={{ alignSelf: "center" }}>
                            <Checkbox status={selected ? "checked" : "unchecked"} />
                        </View>
                    )}
                </View>
            </Pressable>
        ) : (
            <SkeletonPlaceholder backgroundColor={theme.colors.backdrop}>
                <SkeletonPlaceholder.Item
                    width={skeletonWidth}
                    maxWidth={290}
                    height={skeletonHeight}
                    maxHeight={500}
                    borderRadius={15}
                    alignSelf={you ? "flex-end" : "flex-start"}
                />
            </SkeletonPlaceholder>
        )
    ) : null
}
