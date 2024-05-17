import React, { useCallback, useState } from "react"
import { View } from "react-native"
import { Course } from "../../../../types/server/class/Course"
import { Chat } from "../../../../types/server/class/Chat/Chat"
import { IconButton, Surface, Text, TouchableRipple, useTheme } from "react-native-paper"
import { Image } from "expo-image"
import { Message } from "../../../../types/server/class/Chat/Message"
import SkeletonPlaceholder from "react-native-skeleton-placeholder"
import { NavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native"
import { api } from "../../../../backend/api"
import placeholders from "../../../../tools/placeholders"
import { OptionsMenu } from "../../../../components/OptionsMenu/OptionsMenu"

interface CommentContainerProps {
    course: Course
}

export const CommentContainer: React.FC<CommentContainerProps> = ({ course }) => {
    const navigation = useNavigation<NavigationProp<any, any>>()
    const image_size = 50
    const theme = useTheme()

    const chat = course.chat

    const [message, setMessage] = useState<Message | null>(null)
    const [showMenu, setShowMenu] = useState(false)

    const getMessage = async () => {
        try {
            const response = await api.get("/course/last_message", { params: { course_id: course.id } })
            setMessage(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useFocusEffect(
        useCallback(() => {
            getMessage()
        }, [])
    )

    return (
        <Surface style={{ flex: 1, borderRadius: 15 }}>
            <TouchableRipple
                borderless
                style={{ flex: 1, borderRadius: 15, padding: 20, gap: 20 }}
                onPress={() => navigation.navigate("creator:course:chat", { course })}
            >
                <>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <View style={{ gap: 5, maxWidth: 250 }}>
                            <Text variant="bodyLarge" numberOfLines={1}>
                                {course.name}
                            </Text>
                            <Text numberOfLines={1}>{course.description}</Text>
                            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceDisabled }}>
                                Curso
                            </Text>
                        </View>
                        <Image
                            source={course.cover}
                            contentFit={"cover"}
                            style={{ width: image_size, aspectRatio: "1/1", borderRadius: 15 }}
                            placeholder={placeholders.square}
                        />
                    </View>

                    <View
                        style={{
                            borderBottomWidth: 1,
                            borderBottomColor: theme.colors.backdrop,
                            opacity: 0.5,
                        }}
                    ></View>

                    {message ? (
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                            <Image
                                source={message.user?.image || placeholders.avatar}
                                contentFit={"cover"}
                                placeholder={placeholders.avatar}
                                style={{ width: image_size, aspectRatio: "1/1", borderRadius: 100 }}
                            />
                            <View style={{ gap: 5, maxWidth: 210, flex: 1 }}>
                                <Text variant="bodyLarge">{message.user?.name || "Usuário indisponível"}</Text>
                                <Text numberOfLines={3}>{message.text}</Text>
                                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceDisabled }}>
                                    {new Date(Number(message.datetime)).toLocaleString("pt-br")}
                                </Text>
                            </View>
                            <OptionsMenu
                                options={[
                                    { label: "Responder", onPress: () => console.log("creator:course:form") },
                                    { label: "Ir até o comentário", onPress: () => console.log("creator:course:chat") },
                                    { label: "Reportar", onPress: () => console.log("report") },
                                ]}
                                Anchor={<IconButton icon={"dots-vertical"} style={{ margin: 0 }} onPress={() => setShowMenu((show) => !show)} />}
                                onDismiss={() => setShowMenu(false)}
                                visible={showMenu}
                            />
                        </View>
                    ) : (
                        <SkeletonPlaceholder backgroundColor={theme.colors.backdrop}>
                            <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" gap={10}>
                                <SkeletonPlaceholder.Item width={image_size} aspectRatio={"1/1"} borderRadius={100} />
                                <SkeletonPlaceholder.Item gap={5}>
                                    <SkeletonPlaceholder.Item width={100} height={20} borderRadius={10} />
                                    <SkeletonPlaceholder.Item width={250} height={40} borderRadius={10} />
                                </SkeletonPlaceholder.Item>
                            </SkeletonPlaceholder.Item>
                        </SkeletonPlaceholder>
                    )}
                </>
            </TouchableRipple>
        </Surface>
    )
}
