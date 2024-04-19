import React from "react"
import { View } from "react-native"
import { Course } from "../../../types/server/class/Course"
import { Surface, Text, TouchableRipple, useTheme } from "react-native-paper"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { Image } from "expo-image"
import placeholders from "../../../tools/placeholders"

interface CourseCardContainerProps {
    course: Course
}

export const CourseCardContainer: React.FC<CourseCardContainerProps> = ({ course }) => {
    const navigation = useNavigation<NavigationProp<any, any>>()
    const theme = useTheme()

    return (
        <Surface style={{ flex: 1, padding: 5, borderRadius: 15 }}>
            <TouchableRipple
                borderless
                style={{ flexDirection: "row", borderRadius: 15, padding: 5, gap: 5 }}
                // onPress={() => navigation.navigate("creator:lesson", { lesson })}
            >
                <>
                    <Image
                        source={course.cover}
                        placeholder={placeholders.square}
                        contentFit="cover"
                        style={{ width: 100, aspectRatio: "1/1", borderRadius: 15 }}
                    />
                    <View style={{ padding: 5, gap: 2, paddingRight: 140 }}>
                        <Text variant="bodyLarge">{course.name}</Text>
                        <Text numberOfLines={3}>{course.description}</Text>
                        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceDisabled }}>
                            {course.lessons} lições
                        </Text>
                    </View>
                </>
            </TouchableRipple>
        </Surface>
    )
}
