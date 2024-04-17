import { NavigationProp, RouteProp, useFocusEffect } from "@react-navigation/native"
import React, { useCallback, useState } from "react"
import { IconButton, Menu, Surface, Text, TouchableRipple, useTheme } from "react-native-paper"
import { Course } from "../../../types/server/class/Course"
import { ScreenTitle } from "../../../components/ScreenTItle"
import { Dimensions, FlatList, Pressable, TouchableOpacity, View } from "react-native"
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

    const onDelete = () => {
        setShowMenu(false)
        navigation.navigate("creator:course:delete", { course })
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
                    {course.lessons.length} lições
                </Text>
            </View>
            {/* <SkeletonPlaceholder> */}
            <FlatList
                data={course.gallery.media.sort((a, b) => a.position - b.position)}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginHorizontal: -20, flexGrow: 0 }}
                contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
                // initialNumToRender={3}
                // maxToRenderPerBatch={0}
                ListHeaderComponent={
                    course.cover_type == "image" ? (
                        <Image
                            source={course.cover}
                            transition={1000}
                            priority={"high"}
                            placeholder={placeholders.video}
                            contentFit="cover"
                            style={media_style}
                        />
                    ) : (
                        <Video source={{ uri: course.cover }} resizeMode={ResizeMode.COVER} style={media_style} useNativeControls shouldPlay />
                    )
                }
                renderItem={({ item, index }) =>
                    item.type == "IMAGE" ? (
                        <TouchableRipple borderless style={{ borderRadius: 15 }} onPress={() => setViewingMedia(index)}>
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
            {/* </SkeletonPlaceholder> */}
            <Text variant="bodyLarge">Valor: {currencyMask(course.price)}</Text>
            <Text numberOfLines={extendedDescription ? 0 : 3}>{course.description}</Text>
            <TouchableRipple onPress={() => setExtendedDescription((value) => !value)} style={{ alignSelf: "flex-end" }}>
                <Text>ler {extendedDescription ? "menos" : "mais"}...</Text>
            </TouchableRipple>

            <ImageView
                images={course.gallery.media.map((item) => ({ uri: item.url }))}
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
                onPress={() => navigation.navigate("creator:course:lesson:form")}
            >
                Nova lição
            </Button>
        </View>
    ) : null
}
