import { NavigationProp, RouteProp, useFocusEffect } from "@react-navigation/native"
import React, { useCallback, useMemo, useState } from "react"
import { Dimensions, LayoutAnimation, ScrollView, Share, View } from "react-native"
import { ScreenTitle } from "../../components/ScreenTItle"
import { Lesson, PartialLesson } from "../../types/server/class/Course/Lesson"
import { IconButton, Menu, Text, TouchableRipple, useTheme } from "react-native-paper"
import { Image, ImageStyle } from "expo-image"
import { ResizeMode, Video } from "expo-av"
import placeholders from "../../tools/placeholders"
import { MiniStatistics } from "./MiniStatistics"
import { OptionsMenu } from "../../components/OptionsMenu/OptionsMenu"
import { api } from "../../backend/api"
import { StatusText } from "../../components/StatusText"
import { Status, StatusForm } from "../../types/server/class/Course"
import { DeclinedWarning } from "../Creator/ManageCourse/DeclinedWarning"
import { urlGenerator } from "../../tools/urlGenerator"

interface ManageLessonProps {
    navigation: NavigationProp<any, any>
    route: RouteProp<any, any>
}

export const ManageLesson: React.FC<ManageLessonProps> = ({ navigation, route }) => {
    const lesson_id = route.params?.lesson_id as string | undefined
    const [lesson, setLesson] = useState(route.params?.lesson as Lesson | undefined)
    const theme = useTheme()
    const image_width = Dimensions.get("screen").width * 0.9
    const max_image_height = (image_width / 16) * 9
    const media_style: ImageStyle = useMemo(
        () => (lesson ? { width: image_width, borderRadius: 15, aspectRatio: lesson.media.width / lesson.media.height } : {}),
        [lesson]
    )

    const [extendedDescription, setExtendedDescription] = useState(false)
    const [showMenu, setShowMenu] = useState(false)

    const extendDescription = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setExtendedDescription((value) => !value)
    }

    const onMenuItemNavigate = (route: string) => {
        setShowMenu(false)
        navigation.navigate(route, { lesson })
    }

    const onToggle = async (status: Status) => {
        if (!lesson) return
        setShowMenu(false)
        try {
            const data: StatusForm = { id: lesson.id, status: status == "active" ? "disabled" : "active" }
            const response = await api.patch("/lesson", data)
            setLesson(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const refresh = async () => {
        try {
            const response = await api.get("/lesson", { params: { lesson_id: lesson?.id || lesson_id } })
            setLesson(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const onShare = async () => {
        const url = urlGenerator.lesson(lesson?.id)
        await Share.share({ message: url, url, title: "Compartilhar Lição" })
        setShowMenu(false)
    }

    useFocusEffect(
        useCallback(() => {
            refresh()
        }, [])
    )

    return lesson ? (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 10, padding: 20 }}>
            <ScreenTitle
                title={lesson.name}
                right={
                    <OptionsMenu
                        Anchor={<IconButton icon={"dots-vertical"} style={{ margin: 0 }} onPress={() => setShowMenu((show) => !show)} />}
                        anchorPosition="bottom"
                        onDismiss={() => setShowMenu(false)}
                        visible={showMenu}
                        options={[
                            { label: "Editar Lição", onPress: () => onMenuItemNavigate("creator:lesson:form") },
                            { label: "Compartilhar", onPress: onShare },
                            { label: "Deletar", onPress: () => onMenuItemNavigate("creator:lesson:delete") },
                            {
                                label: lesson.status == "active" ? "Desativar" : lesson.status == "disabled" ? "Ativar" : "Pendente",
                                onPress: () => onToggle(lesson.status),
                                disabled: lesson.status !== "active" && lesson.status !== "disabled",
                            },
                        ]}
                    />
                }
            />
            {lesson.status == "declined" && <DeclinedWarning lesson onEditPress={() => onMenuItemNavigate("creator:lesson:form")} />}
            {lesson.media.type == "image" ? (
                <Image source={lesson.media.url} style={media_style} placeholder={placeholders.video} />
            ) : (
                <Video
                    source={{ uri: lesson.media.url }}
                    style={[media_style]}
                    useNativeControls
                    shouldPlay
                    resizeMode={ResizeMode.CONTAIN}
                    onError={(error) => console.log(error)}
                />
            )}
            <Text numberOfLines={!extendedDescription ? 2 : undefined}>{lesson.info}</Text>
            <TouchableRipple onPress={extendDescription} style={{ alignSelf: "flex-end", marginTop: -10 }}>
                <Text style={{ textDecorationLine: "underline" }}>ler {extendedDescription ? "menos" : "mais"}...</Text>
            </TouchableRipple>

            <StatusText status={lesson.status} />
            <MiniStatistics lesson={lesson} />
        </ScrollView>
    ) : null
}
