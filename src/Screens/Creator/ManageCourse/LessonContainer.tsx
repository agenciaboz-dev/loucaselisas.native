import React, { useEffect, useState } from "react"
import { Animated, LayoutAnimation, View } from "react-native"
import { Lesson, PartialLesson } from "../../../types/server/class/Course/Lesson"
import { ActivityIndicator, Icon, IconButton, Menu, Surface, Text, TouchableRipple, useTheme } from "react-native-paper"
import { Image } from "expo-image"
import { TrianguloMiseravel } from "../../../components/TrianguloMiseravel"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { LessonsSkeletons } from "./LessonsSkeletons"
import { api } from "../../../backend/api"
import { formatStatus, formatStatusColor } from "../../../tools/formatStatus"

interface LessonContainerProps {
    current_lesson: Lesson
    index: number
    refresh: (timeout?: number) => Promise<void>
}

export const LessonContainer: React.FC<LessonContainerProps> = ({ current_lesson, index, refresh }) => {
    const theme = useTheme()
    const navigation = useNavigation<NavigationProp<any, any>>()

    const [lesson, setLesson] = useState(current_lesson)
    const [showMenu, setShowMenu] = useState(false)
    const [switchingActive, setSwitchingActive] = useState(false)

    const onDelete = () => {
        setShowMenu(false)
        navigation.navigate("creator:lesson:delete", { lesson })
    }

    const onDisable = async () => {
        setShowMenu(false)
        setSwitchingActive(true)
        setTimeout(async () => {
            try {
                const data: PartialLesson = { id: lesson.id, status: "disabled" }
                const response = await api.patch("/lesson", data)
                // TODO: ACTIVATE ON BUILD
                // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
                setLesson(response.data)
                // refresh(0)
            } catch (error) {
                console.log(error)
            } finally {
                setSwitchingActive(false)
            }
        }, 1000)
    }

    useEffect(() => {
        setLesson(current_lesson)
    }, [current_lesson])

    return (
        <Surface style={[{ flex: 1, backgroundColor: theme.colors.background, borderRadius: 15, position: "relative" }]}>
            <TouchableRipple
                borderless
                style={{ flexDirection: "row", borderRadius: 15, padding: 5, gap: 5 }}
                onPress={() => navigation.navigate("creator:lesson", { lesson })}
            >
                <>
                    <Image source={lesson.thumb} contentFit="cover" style={{ width: 100, aspectRatio: "1/1", borderRadius: 15 }} />
                    <View style={{ padding: 5, gap: 2, paddingRight: 140 }}>
                        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceDisabled }}>
                            Lição {index + 1}
                        </Text>
                        <Text variant="bodyLarge">{lesson.name}</Text>
                        <Text numberOfLines={2}>{lesson.info}</Text>
                    </View>
                    <View style={{ marginLeft: "auto", alignSelf: "center" }}>
                        <Menu
                            visible={showMenu}
                            onDismiss={() => setShowMenu(false)}
                            anchorPosition="bottom"
                            anchor={<IconButton loading={switchingActive} icon={"dots-vertical"} onPress={() => setShowMenu((value) => !value)} />}
                            contentStyle={{ borderRadius: 15 }}
                            style={{ marginTop: 35 }}
                        >
                            <TrianguloMiseravel color={theme.colors.elevation.level3} top={-9} right={15} />
                            <View style={{ paddingVertical: 0 }}>
                                <TouchableRipple style={{ paddingHorizontal: 20, paddingVertical: 10 }} onPress={onDisable}>
                                    <Text>{lesson.status == "active" ? "Desabilitar" : "Habilitar"}</Text>
                                </TouchableRipple>
                                <TouchableRipple style={{ paddingHorizontal: 20, paddingVertical: 10 }} onPress={onDelete}>
                                    <Text>Deletar</Text>
                                </TouchableRipple>
                            </View>
                        </Menu>
                    </View>
                    <Surface
                        style={{
                            position: "absolute",
                            right: 5,
                            top: 5,
                            padding: 5,
                            paddingVertical: 2,
                            borderRadius: 15,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        <Text variant="labelSmall">{formatStatus(lesson.status)}</Text>
                        <Icon size={12} source={"circle"} color={formatStatusColor(lesson.status)} />
                    </Surface>
                </>
            </TouchableRipple>
        </Surface>
    )
}
