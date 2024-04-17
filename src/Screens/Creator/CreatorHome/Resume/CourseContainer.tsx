import React from "react"
import { Icon, Surface, Text, TouchableRipple, useTheme } from "react-native-paper"
import { Course } from "../../../../types/server/class/Course"
import { Image } from "expo-image"
import placeholders from "../../../../tools/placeholders"
import { TouchableOpacity, View } from "react-native"
import { NavigationProp, useNavigation } from "@react-navigation/native"

interface CourseContainerProps {
    course: Course
}

export const CourseContainer: React.FC<CourseContainerProps> = ({ course }) => {
    const theme = useTheme()
    const navigation = useNavigation<NavigationProp<any, any>>()

    const onCoursePress = () => {
        navigation.navigate("creator:course:manage", { course })
    }

    return (
        <Surface elevation={1} style={{ borderRadius: 10 }}>
            <TouchableRipple borderless style={{ position: "relative", borderRadius: 10 }} onPress={onCoursePress}>
                <>
                    <Image
                        source={course.cover || placeholders.square}
                        style={{ borderRadius: 10, width: 175, aspectRatio: "1/1" }}
                        contentFit="cover"
                    />
                    <View style={{ position: "absolute", padding: 10, justifyContent: "flex-end", height: "100%", gap: 5 }}>
                        <Text style={{ backgroundColor: theme.colors.background, padding: 5, borderRadius: 5, alignSelf: "flex-start" }}>
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
                </>
            </TouchableRipple>
        </Surface>
    )
}
