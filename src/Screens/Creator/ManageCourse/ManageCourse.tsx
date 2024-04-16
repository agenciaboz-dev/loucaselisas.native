import { NavigationProp, RouteProp, useFocusEffect } from "@react-navigation/native"
import React, { useCallback, useState } from "react"
import { IconButton, Menu, Surface, Text, TouchableRipple, useTheme } from "react-native-paper"
import { Course } from "../../../types/server/class/Course"
import { ScreenTitle } from "../../../components/ScreenTItle"
import { Dimensions, FlatList, View } from "react-native"
import { Image, ImageStyle } from "expo-image"
import { ResizeMode, Video } from "expo-av"
import placeholders from "../../../tools/placeholders"
import SkeletonPlaceholder from "react-native-skeleton-placeholder"
import { currencyMask } from "../../../tools/currencyMask"
import { TrianguloMiseravel } from "../../../components/TrianguloMiseravel"
import { api } from "../../../backend/api"
import { Button } from "../../../components/Button"
import { MiniStatistics } from "./MiniStatistics"

interface ManageCourseProps {
    navigation: NavigationProp<any, any>
    route: RouteProp<any, any>
}

export const ManageCourse: React.FC<ManageCourseProps> = ({ navigation, route }) => {
    const theme = useTheme()
    const image_width = Dimensions.get("screen").width * 0.9
    const media_style: ImageStyle = { width: image_width, aspectRatio: "16/9", borderRadius: 15 }

    const [showMenu, setShowMenu] = useState(false)
    const [course, setCourse] = useState(route.params?.course as Course | undefined)
    const [extendedDescription, setExtendedDescription] = useState(false)

    const onMenuItemPress = (route: string) => {
        setShowMenu(false)
        navigation.navigate(route, { course })
    }

    const refreshCourse = async () => {
        try {
            const response = await api.get("/course", { params: { course_id: course?.id } })
            setCourse(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useFocusEffect(
        useCallback(() => {
            refreshCourse()
        }, [])
    )

    return course ? (
        <View style={{ flex: 1, padding: 20, gap: 10 }}>
            <ScreenTitle
                title={course.name}
                right={
                    <Menu
                        visible={showMenu}
                        onDismiss={() => setShowMenu(false)}
                        anchorPosition="bottom"
                        anchor={<IconButton icon={"dots-vertical"} style={{ margin: 0 }} onPress={() => setShowMenu((show) => !show)} />}
                        contentStyle={{ borderRadius: 15 }}
                    >
                        <TrianguloMiseravel color={theme.colors.elevation.level3} right={10} />
                        <View style={{ paddingVertical: 10 }}>
                            <TouchableRipple
                                style={{ paddingHorizontal: 20, paddingVertical: 10 }}
                                onPress={() => onMenuItemPress("creator:course:form")}
                            >
                                <Text>Editar curso</Text>
                            </TouchableRipple>
                            <TouchableRipple
                                style={{ paddingHorizontal: 20, paddingVertical: 10 }}
                                onPress={() => onMenuItemPress("creator:course:delete")}
                            >
                                <Text>Deletar</Text>
                            </TouchableRipple>
                        </View>
                    </Menu>
                }
            />
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                    {course.owner.nickname}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                    {course.lessons.length} lições
                </Text>
            </View>
            {/* <SkeletonPlaceholder> */}
            <FlatList
                data={course.gallery.media}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginHorizontal: -20, flexGrow: 0 }}
                contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
                ListHeaderComponent={
                    course.cover_type == "image" ? (
                        <Image source={course.cover || placeholders.cover} contentFit="cover" style={media_style} />
                    ) : (
                        <Video source={{ uri: course.cover }} resizeMode={ResizeMode.COVER} style={media_style} useNativeControls shouldPlay />
                    )
                }
                renderItem={({ item }) =>
                    item.type == "IMAGE" ? (
                        <Image source={item.url || placeholders.cover} contentFit="cover" style={media_style} />
                    ) : (
                        <Video source={{ uri: item.url }} resizeMode={ResizeMode.COVER} style={media_style} useNativeControls shouldPlay />
                    )
                }
            />
            {/* </SkeletonPlaceholder> */}
            <Text variant="bodyLarge">Valor: {currencyMask(course.price)}</Text>
            <Text numberOfLines={extendedDescription ? 0 : 3}>{course.description}</Text>
            <TouchableRipple onPress={() => setExtendedDescription((value) => !value)} style={{ alignSelf: "flex-end" }}>
                <Text>ler {extendedDescription ? "menos" : "mais"}...</Text>
            </TouchableRipple>

            <MiniStatistics course={course} />
        </View>
    ) : null
}
