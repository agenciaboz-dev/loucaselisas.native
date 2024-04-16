import React from "react"
import { Icon, Surface, Text, TouchableRipple, useTheme } from "react-native-paper"
import { Course } from "../../../../types/server/class/Course"
import { Image } from "expo-image"
import placeholders from "../../../../tools/placeholders"
import { TouchableOpacity, View } from "react-native"

interface CourseContainerProps {
    course: Course
}

export const CourseContainer: React.FC<CourseContainerProps> = ({ course }) => {
    const theme = useTheme()
    const onCoursePress = () => {
        console.log("a")
    }

    return (
        <TouchableOpacity style={{ position: "relative" }} onPress={onCoursePress}>
            <Image
                source={course.cover || placeholders.image_placeholder}
                style={{ borderRadius: 10, width: 150, aspectRatio: "1/1" }}
                contentFit="cover"
            />
            <View style={{ position: "absolute", padding: 10, justifyContent: "flex-end", height: "100%", gap: 5 }}>
                <Text style={{ backgroundColor: theme.colors.background, padding: 5, borderRadius: 5, alignSelf: "flex-start" }}>{course.name}</Text>
                <TouchableRipple
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: theme.colors.background,
                        padding: 5,
                        borderRadius: 5,
                        gap: 5,
                    }}
                    // pointerEvents="none"
                    onPress={() => console.log("comments")}
                >
                    <>
                        <Text variant="labelSmall">{course.lessons.length} lições</Text>
                        <Icon size={15} source={"comment-text-outline"} />
                    </>
                </TouchableRipple>
            </View>
        </TouchableOpacity>
    )
}
