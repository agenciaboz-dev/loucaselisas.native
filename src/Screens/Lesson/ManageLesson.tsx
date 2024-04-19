import { NavigationProp, RouteProp } from "@react-navigation/native"
import React, { useState } from "react"
import { Dimensions, LayoutAnimation, View } from "react-native"
import { ScreenTitle } from "../../components/ScreenTItle"
import { Lesson } from "../../types/server/class/Course/Lesson"
import { IconButton, Menu, Text, TouchableRipple, useTheme } from "react-native-paper"
import { Image, ImageStyle } from "expo-image"
import { Video } from "expo-av"
import placeholders from "../../tools/placeholders"
import { MiniStatistics } from "./MiniStatistics"
import { TrianguloMiseravel } from "../../components/TrianguloMiseravel"

interface ManageLessonProps {
    navigation: NavigationProp<any, any>
    route: RouteProp<any, any>
}

export const ManageLesson: React.FC<ManageLessonProps> = ({ navigation, route }) => {
    const lesson = route.params?.lesson as Lesson
    const theme = useTheme()
    const image_width = Dimensions.get("screen").width * 0.9
    const max_image_height = (image_width / 16) * 9
    const media_style: ImageStyle = { width: image_width, height: max_image_height, borderRadius: 15 }

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

    return lesson ? (
        <View style={{ flex: 1, gap: 10, padding: 20 }}>
            <ScreenTitle
                title={lesson.name}
                right={
                    <Menu
                        visible={showMenu}
                        onDismiss={() => setShowMenu(false)}
                        anchorPosition="bottom"
                        anchor={<IconButton icon={"dots-vertical"} style={{ margin: 0 }} onPress={() => setShowMenu((show) => !show)} />}
                        contentStyle={{ borderRadius: 15 }}
                    >
                        <TrianguloMiseravel color={theme.colors.elevation.level3} right={10} />
                        <View style={{ paddingVertical: 0 }}>
                            <TouchableRipple
                                style={{ paddingHorizontal: 20, paddingVertical: 10 }}
                                onPress={() => onMenuItemNavigate("creator:lesson:form")}
                            >
                                <Text>Editar lição</Text>
                            </TouchableRipple>
                            <TouchableRipple
                                style={{ paddingHorizontal: 20, paddingVertical: 10 }}
                                onPress={() => onMenuItemNavigate("creator:lesson:delete")}
                            >
                                <Text>Deletar</Text>
                            </TouchableRipple>
                        </View>
                    </Menu>
                }
            />
            {lesson.media.type == "IMAGE" ? (
                <Image source={lesson.media.url} style={media_style} placeholder={placeholders.video} />
            ) : (
                <Video source={{ uri: lesson.media.url }} style={media_style} useNativeControls shouldPlay />
            )}
            <Text numberOfLines={!extendedDescription ? 2 : undefined}>{lesson.info}</Text>
            <TouchableRipple onPress={extendDescription} style={{ alignSelf: "flex-end", marginTop: -10 }}>
                <Text style={{ textDecorationLine: "underline" }}>ler {extendedDescription ? "menos" : "mais"}...</Text>
            </TouchableRipple>
            <MiniStatistics lesson={lesson} />
        </View>
    ) : null
}
