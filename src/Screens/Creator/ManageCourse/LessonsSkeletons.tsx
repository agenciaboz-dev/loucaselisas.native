import React from "react"
import { View } from "react-native"
import { Surface, useTheme } from "react-native-paper"
import SkeletonPlaceholder from "react-native-skeleton-placeholder"

interface LessonsSkeletonsProps {}

export const LessonsSkeletons: React.FC<LessonsSkeletonsProps> = ({}) => {
    const theme = useTheme()
    const text_height = 15

    return (
        <Surface style={{ height: 110, borderRadius: 15 }}>
            <SkeletonPlaceholder backgroundColor={theme.colors.backdrop}>
                <View style={{ padding: 5, gap: 5, flexDirection: "row", width: "auto" }}>
                    <SkeletonPlaceholder.Item height={100} width={100} borderRadius={15} />
                    <View style={{ padding: 7, gap: 5 }}>
                        <SkeletonPlaceholder.Item height={text_height} width={50} borderRadius={5} />
                        <SkeletonPlaceholder.Item height={text_height} width={100} borderRadius={5} />
                        <SkeletonPlaceholder.Item height={text_height * 2} width={200} borderRadius={5} />
                    </View>
                </View>
            </SkeletonPlaceholder>
        </Surface>
    )
}
