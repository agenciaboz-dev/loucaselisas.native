import React, { useState } from "react"
import { View } from "react-native"
import { Lesson } from "../../../types/server/class/Course/Lesson"
import { IconButton, Menu, Surface, Text, TouchableRipple, useTheme } from "react-native-paper"
import { Image } from "expo-image"
import { TrianguloMiseravel } from "../../../components/TrianguloMiseravel"
import { NavigationProp, useNavigation } from "@react-navigation/native"

interface LessonContainerProps {
    lesson: Lesson
    index: number
    refresh: () => Promise<void>
}

export const LessonContainer: React.FC<LessonContainerProps> = ({ lesson, index, refresh }) => {
    const theme = useTheme()
    const navigation = useNavigation<NavigationProp<any, any>>()

    const [showMenu, setShowMenu] = useState(false)

    const onDelete = () => {
        setShowMenu(false)
        navigation.navigate("creator:lesson:delete", { lesson })
    }

    const onDisable = () => {}

    return (
        <Surface style={{ flex: 1, backgroundColor: theme.colors.background, borderRadius: 15 }}>
            <TouchableRipple borderless style={{ flexDirection: "row", borderRadius: 15, padding: 5, gap: 5 }} onPress={() => console.log()}>
                <>
                    <Image source={lesson.thumb} contentFit="cover" style={{ width: 100, aspectRatio: "1/1", borderRadius: 15 }} />
                    <View style={{ padding: 5, gap: 2, paddingRight: 140 }}>
                        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceDisabled }}>
                            Lição {index + 1}
                        </Text>
                        <Text variant="bodyLarge">{lesson.name}</Text>
                        <Text numberOfLines={2}>{lesson.info}</Text>
                    </View>
                    <View style={{ marginLeft: "auto", alignSelf: "center" }}>
                        <Menu
                            visible={showMenu}
                            onDismiss={() => setShowMenu(false)}
                            anchorPosition="bottom"
                            anchor={<IconButton icon={"dots-vertical"} onPress={() => setShowMenu((value) => !value)} />}
                            contentStyle={{ borderRadius: 15 }}
                        >
                            <TrianguloMiseravel color={theme.colors.elevation.level3} top={-9} right={15} />
                            <View style={{ paddingVertical: 5 }}>
                                <TouchableRipple style={{ paddingHorizontal: 20, paddingVertical: 10 }} onPress={onDisable}>
                                    <Text>Desabilitar</Text>
                                </TouchableRipple>
                                <TouchableRipple style={{ paddingHorizontal: 20, paddingVertical: 10 }} onPress={onDelete}>
                                    <Text>Deletar</Text>
                                </TouchableRipple>
                            </View>
                        </Menu>
                    </View>
                </>
            </TouchableRipple>
        </Surface>
    )
}
