import React from "react"
import { View } from "react-native"
import { Course } from "../../../../types/server/class/Course"
import { Surface, Text, TouchableRipple } from "react-native-paper"
import { Image } from "expo-image"
import { StatData } from "./StatData"

interface CourseStatsContainerProps {
    course: Course
}

export const CourseStatsContainer: React.FC<CourseStatsContainerProps> = ({ course }) => {
    return (
        <Surface style={{ borderRadius: 15 }}>
            <TouchableRipple borderless style={{ borderRadius: 15, padding: 10, flexDirection: "row", gap: 10 }}>
                <>
                    <View style={{ gap: 5 }}>
                        <Text variant="bodyLarge" style={{ alignSelf: "center" }}>
                            {course.name}
                        </Text>
                        <Image source={course.cover} style={{ width: 75, aspectRatio: "1/1", borderRadius: 15 }} contentFit="cover" />
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingHorizontal: 10,
                            alignSelf: "center",
                            flex: 1,
                        }}
                    >
                        <StatData icon="eye-outline" value={course.views} />
                        <StatData icon="heart-outline" value={course.likes} />
                        <StatData icon="comment-text-outline" value={course.chat?.messages || 0} />
                    </View>
                </>
            </TouchableRipple>
        </Surface>
    )
}
