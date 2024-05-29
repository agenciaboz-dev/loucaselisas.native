import ImageView from "react-native-image-viewing"
import React, { useState } from "react"
import { Dimensions, FlatList, View } from "react-native"
import { Course } from "../types/server/class/Course"
import { Surface, Text, TouchableRipple, useTheme } from "react-native-paper"
import { Image, ImageStyle } from "expo-image"
import placeholders from "../tools/placeholders"
import { ResizeMode, Video, VideoFullscreenUpdateEvent } from "expo-av"
import * as ScreenOrientation from "expo-screen-orientation"

interface CourseGalleryProps {
    course: Course
}

export const CourseGallery: React.FC<CourseGalleryProps> = ({ course }) => {
    const theme = useTheme()

    const image_width = Dimensions.get("screen").width * 0.9
    const max_image_height = (image_width / 16) * 9
    const media_style: ImageStyle = { width: image_width, height: max_image_height, borderRadius: 15 }

    const [viewingMedia, setViewingMedia] = useState<number | null>(null)

    const handleFullscreen = async (event: VideoFullscreenUpdateEvent) => {
        if (event.fullscreenUpdate == 1) {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
        }
        if (event.fullscreenUpdate == 3) {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
        }
    }

    return (
        <>
            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 2 }}>
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
                contentContainerStyle={{ paddingHorizontal: 20, gap: 10, paddingVertical: 5 }}
                // initialNumToRender={3}
                // maxToRenderPerBatch={0}
                ListHeaderComponent={
                    <Surface style={{ borderRadius: 15 }}>
                        {course.cover_type == "image" ? (
                            <TouchableRipple borderless style={{ borderRadius: 15 }} onPress={() => setViewingMedia(0)}>
                                <Image
                                    source={course.cover}
                                    transition={1000}
                                    priority={"high"}
                                    placeholder={placeholders.video}
                                    placeholderContentFit="cover"
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
                                onFullscreenUpdate={handleFullscreen}
                                shouldPlay
                                onError={(error) => console.log(`course cover error: ${error}`)}
                            />
                        )}
                    </Surface>
                }
                renderItem={({ item, index }) => (
                    <Surface style={{ borderRadius: 15 }}>
                        {item.type == "image" ? (
                            <TouchableRipple borderless style={{ borderRadius: 15 }} onPress={() => setViewingMedia(index + 1)}>
                                <Image
                                    source={item.url}
                                    placeholder={placeholders.square}
                                    contentFit="contain"
                                    placeholderContentFit="cover"
                                    style={[media_style, { aspectRatio: item.width / item.height, width: undefined }]}
                                />
                            </TouchableRipple>
                        ) : (
                            <Video
                                source={{ uri: item.url }}
                                resizeMode={ResizeMode.COVER}
                                style={media_style}
                                onFullscreenUpdate={handleFullscreen}
                                useNativeControls
                                onError={(error) => console.log(`course gallery item ${item.id} error: ${error}`)}
                            />
                        )}
                    </Surface>
                )}
            />

            <ImageView
                images={[{ uri: course.cover }, ...course.gallery.media.map((item) => ({ uri: item.url }))]}
                imageIndex={viewingMedia ?? 0}
                visible={viewingMedia !== null}
                onRequestClose={() => setViewingMedia(null)}
                animationType="slide"
            />
        </>
    )
}
