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
        <Surface style={{ flex: 1, borderRadius: 15 }}>
            <TouchableRipple
                borderless
                style={{ flexDirection: "row", borderRadius: 15, padding: 5, gap: 5, alignItems: "center" }}
                onPress={() => navigation.navigate("course:profile", { course })}
            >
                <>
                    <Image
                        source={course.cover}
                        placeholder={placeholders.square}
                        placeholderContentFit="cover"
                        contentFit="cover"
                        style={{ width: 100, aspectRatio: "1/1", borderRadius: 15 }}
                    />
                    <View style={{ padding: 5, gap: 2, paddingRight: 140, flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
                        <Text variant="bodyLarge" style={{ fontFamily: "Lato_700Bold" }} numberOfLines={1}>
                            {course.name}
                        </Text>
                        <Text numberOfLines={3}>{course.description}</Text>
                        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceDisabled, marginTop: "auto" }}>
                            {course.lessons} lições
                        </Text>
                    </View>
                </>
            </TouchableRipple>
        </Surface>
    )
}
