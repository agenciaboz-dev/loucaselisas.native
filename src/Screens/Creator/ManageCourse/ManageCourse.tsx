import { NavigationProp, RouteProp, useFocusEffect } from "@react-navigation/native"
import React, { useCallback, useState } from "react"
import { IconButton, Menu, Surface, Text, TouchableRipple, useTheme } from "react-native-paper"
import { Course } from "../../../types/server/class/Course"
import { ScreenTitle } from "../../../components/ScreenTItle"
import { Dimensions, FlatList, LayoutAnimation, Pressable, TouchableOpacity, View } from "react-native"
import { Image, ImageStyle } from "expo-image"
import { ResizeMode, Video } from "expo-av"
import placeholders from "../../../tools/placeholders"
import SkeletonPlaceholder from "react-native-skeleton-placeholder"
import { currencyMask } from "../../../tools/currencyMask"
import { TrianguloMiseravel } from "../../../components/TrianguloMiseravel"
import { api } from "../../../backend/api"
import { MiniStatistics } from "./MiniStatistics"
import ImageView from "react-native-image-viewing"
import { Button } from "../../../components/Button"
import { Lesson } from "../../../types/server/class/Course/Lesson"
import { LessonContainer } from "./LessonContainer"

interface ManageCourseProps {
    navigation: NavigationProp<any, any>
    route: RouteProp<any, any>
}

export const ManageCourse: React.FC<ManageCourseProps> = ({ navigation, route }) => {
    const theme = useTheme()
    const image_width = Dimensions.get("screen").width * 0.9
    const max_image_height = (image_width / 16) * 9
    const media_style: ImageStyle = { width: image_width, height: max_image_height, borderRadius: 15 }

    const [showMenu, setShowMenu] = useState(false)
    const [course, setCourse] = useState(route.params?.course as Course | undefined)
    const [extendedDescription, setExtendedDescription] = useState(false)
    const [viewingMedia, setViewingMedia] = useState<number | null>(null)
    const [lessons, setLessons] = useState<Lesson[]>([])
    const [loadingLessons, setLoadingLessons] = useState(false)

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

    const refreshLessons = async () => {
        setLoadingLessons(true)
        try {
            const response = await api.get("/lesson", { params: { course_id: course?.id } })
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
            setLessons(response.data)
            console.log(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoadingLessons(false)
        }
    }

    const onDelete = () => {
        setShowMenu(false)
        navigation.navigate("creator:course:delete", { course })
    }

    const extendDescription = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setExtendedDescription((value) => !value)
    }

    useFocusEffect(
        useCallback(() => {
            refreshLessons()
            refreshCourse()
        }, [])
    )

    return course ? (
        <View style={{ flex: 1, paddingHorizontal: 20, gap: 10 }}>
            <FlatList
                data={lessons.sort((a, b) => Number(b.published) - Number(a.published))}
                renderItem={({ item, index }) => <LessonContainer lesson={item} index={lessons.length - index - 1} />}
                refreshing={loadingLessons}
                onRefresh={refreshLessons}
                style={{ marginHorizontal: -20, paddingTop: 10 }}
                contentContainerStyle={{ gap: 10, paddingBottom: 10, paddingHorizontal: 20 }}
                showsVerticalScrollIndicator
                ListHeaderComponent={
                    <>
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
                                        <TouchableRipple style={{ paddingHorizontal: 20, paddingVertical: 10 }} onPress={onDelete}>
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
                                {course.lessons} lições
                            </Text>
                        </View>
                        <FlatList
                            data={course.gallery.media.sort((a, b) => a.position - b.position)}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{ marginHorizontal: -20, flexGrow: 0, flexShrink: 0 }}
                            contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
                            // initialNumToRender={3}
                            // maxToRenderPerBatch={0}
                            ListHeaderComponent={
                                course.cover_type == "image" ? (
                                    <TouchableRipple borderless style={{ borderRadius: 15 }} onPress={() => setViewingMedia(0)}>
                                        <Image
                                            source={course.cover}
                                            transition={1000}
                                            priority={"high"}
                                            placeholder={placeholders.video}
                                            contentFit="cover"
                                            style={media_style}
                                        />
                                    </TouchableRipple>
                                ) : (
                                    <Video
                                        source={{ uri: course.cover }}
                                        resizeMode={ResizeMode.COVER}
                                        style={media_style}
                                        useNativeControls
                                        shouldPlay
                                    />
                                )
                            }
                            renderItem={({ item, index }) =>
                                item.type == "IMAGE" ? (
                                    <TouchableRipple borderless style={{ borderRadius: 15 }} onPress={() => setViewingMedia(index + 1)}>
                                        <Image
                                            source={item.url}
                                            placeholder={placeholders.square}
                                            contentFit="contain"
                                            style={[media_style, { aspectRatio: item.width / item.height, width: undefined }]}
                                        />
                                    </TouchableRipple>
                                ) : (
                                    <Video source={{ uri: item.url }} resizeMode={ResizeMode.COVER} style={media_style} useNativeControls />
                                )
                            }
                        />

                        <Text variant="bodyLarge">Valor: {currencyMask(course.price)}</Text>

                        <Text numberOfLines={!extendedDescription ? 2 : undefined}>{course.description}</Text>
                        <TouchableRipple onPress={extendDescription} style={{ alignSelf: "flex-end", marginTop: -10 }}>
                            <Text style={{ textDecorationLine: "underline" }}>ler {extendedDescription ? "menos" : "mais"}...</Text>
                        </TouchableRipple>

                        <ImageView
                            images={[{ uri: course.cover }, ...course.gallery.media.map((item) => ({ uri: item.url }))]}
                            imageIndex={viewingMedia ?? 0}
                            visible={viewingMedia !== null}
                            onRequestClose={() => setViewingMedia(null)}
                            animationType="slide"
                        />

                        <MiniStatistics course={course} />
                        <Button
                            icon={"plus-circle"}
                            mode="outlined"
                            style={{ borderStyle: "dashed", marginTop: 10 }}
                            onPress={() => navigation.navigate("creator:course:lesson:form", { course })}
                        >
                            Nova lição
                        </Button>
                    </>
                }
            />
        </View>
    ) : null
}
