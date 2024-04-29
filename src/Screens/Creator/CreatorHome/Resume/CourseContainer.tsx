import React, { useState } from "react"
import { Icon, Surface, Text, TouchableRipple, useTheme } from "react-native-paper"
import { Course } from "../../../../types/server/class/Course"
import { Image } from "expo-image"
import placeholders from "../../../../tools/placeholders"
import { View } from "react-native"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import * as VideoThumbnails from "expo-video-thumbnails"

interface CourseContainerProps {
    course: Course
    route: string
}

export const CourseContainer: React.FC<CourseContainerProps> = ({ course, route }) => {
    const theme = useTheme()
    const navigation = useNavigation<NavigationProp<any, any>>()

    const [coverSource, setCoverSource] = useState(course.cover)

    const onThumbError = async (error: string) => {
        if (error == "Downloaded image decode failed") {
            try {
                const { uri } = await VideoThumbnails.getThumbnailAsync(course.cover, { time: 0 })
                setCoverSource(uri)
            } catch (error) {
                console.log(error)
            }
        }
    }

    const onCoursePress = () => {
        navigation.navigate(route, { course })
    }

    return (
        <Surface elevation={1} style={{ borderRadius: 10 }}>
            <TouchableRipple borderless style={{ position: "relative", borderRadius: 10 }} onPress={onCoursePress}>
                <>
                    <Image
                        source={coverSource}
                        placeholder={placeholders.square}
                        placeholderContentFit="contain"
                        style={{ borderRadius: 10, width: 175, aspectRatio: "1/1" }}
                        contentFit="cover"
                        onError={(ev) => onThumbError(ev.error)}
                    />
                    <View style={{ position: "absolute", padding: 10, justifyContent: "flex-end", height: "100%", gap: 5 }}>
                        <Text
                            style={{ backgroundColor: theme.colors.background, padding: 5, borderRadius: 5, alignSelf: "flex-start" }}
                            numberOfLines={2}
                        >
                            {course.name}
                        </Text>
                        <TouchableRipple
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                backgroundColor: theme.colors.background,
                                padding: 5,
                                borderRadius: 5,
                                gap: 5,
                                alignSelf: "flex-start",
                            }}
                            // pointerEvents="none"
                            onPress={() => console.log("comments")}
                        >
                            <>
                                <Text variant="labelSmall">{course.lessons} lições</Text>
                                <Icon size={15} source={"comment-text-outline"} />
                            </>
                        </TouchableRipple>
                    </View>
                </>
            </TouchableRipple>
        </Surface>
    )
}
