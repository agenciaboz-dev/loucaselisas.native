import React from "react"
import { View } from "react-native"
import { Lesson } from "../../types/server/class/Course/Lesson"
import { Surface, Text, TouchableRipple, useTheme } from "react-native-paper"
import { Image } from "expo-image"
import { NavigationProp, useNavigation } from "@react-navigation/native"

interface LesonSquareComponentProps {
    lesson: Lesson
}

export const LesonSquareComponent: React.FC<LesonSquareComponentProps> = ({ lesson }) => {
    const navigation = useNavigation<any>()
    const theme = useTheme()
    const image_size = 175

    return (
        <Surface style={{ borderRadius: 15, height: image_size }}>
            <TouchableRipple borderless style={{ borderRadius: 15 }} onPress={() => navigation.push("lesson", { lesson })}>
                <View style={{ position: "relative" }}>
                    <Image source={lesson.thumb} contentFit="cover" style={{ width: image_size, aspectRatio: 1 }} placeholderContentFit="cover" />
                    <Surface
                        style={{
                            width: "80%",
                            position: "absolute",
                            bottom: 20,
                            alignSelf: "center",
                            padding: 5,
                            borderRadius: 5,
                        }}
                    >
                        <Text numberOfLines={1}>{lesson.name}</Text>
                        <Text variant="labelMedium" style={{ color: theme.colors.backdrop }}>
                            {lesson.views} visualizações
                        </Text>
                    </Surface>
                </View>
            </TouchableRipple>
        </Surface>
    )
}
