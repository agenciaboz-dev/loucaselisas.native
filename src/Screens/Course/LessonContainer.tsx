import React from "react"
import { View } from "react-native"
import { Lesson } from "../../types/server/class/Course/Lesson"
import { IconButton, Surface, Text, TouchableRipple, useTheme } from "react-native-paper"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { Image } from "expo-image"
import { OptionsMenu } from "../../components/OptionsMenu/OptionsMenu"
import { useUser } from "../../hooks/useUser"

interface LessonContainerProps {
    lesson: Lesson
    index: number
}

export const LessonContainer: React.FC<LessonContainerProps> = ({ lesson, index }) => {
    const { user } = useUser()

    const navigation = useNavigation<NavigationProp<any, any>>()
    const theme = useTheme()

    return user ? (
        <Surface style={[{ backgroundColor: theme.colors.background, borderRadius: 15, opacity: lesson.active ? 1 : 0.5 }]}>
            <TouchableRipple
                borderless
                style={{ flexDirection: "row", borderRadius: 15, padding: 5, gap: 5 }}
                onPress={() => navigation.navigate("lesson", { lesson })}
                disabled={!lesson.active}
            >
                <>
                    <Image source={lesson.thumb} contentFit="cover" style={{ width: 100, aspectRatio: "1/1", borderRadius: 15 }} />
                    <View style={{ padding: 5, gap: 2, paddingRight: 140 }}>
                        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceDisabled }}>
                            Lição {index}
                        </Text>
                        <Text variant="bodyLarge">{lesson.name}</Text>
                        <Text numberOfLines={2}>{lesson.info}</Text>
                    </View>
                    <View style={{ marginLeft: "auto", alignSelf: "center" }}>
                        <IconButton icon={"heart-outline"} />
                        {/* <OptionsMenu  /> */}
                    </View>
                </>
            </TouchableRipple>
        </Surface>
    ) : null
}
