import React from "react"
import { View } from "react-native"
import { Surface, useTheme } from "react-native-paper"
import SkeletonPlaceholder from "react-native-skeleton-placeholder"

interface FavoritesSkeletonsProps {}

export const FavoritesSkeletons: React.FC<FavoritesSkeletonsProps> = ({}) => {
    const theme = useTheme()
    const text_height = 15

    return (
        <Surface style={{ height: 175, borderRadius: 15, gap: 15 }}>
            <SkeletonPlaceholder backgroundColor={theme.colors.backdrop}>
                <View style={{ padding: 10, gap: 5, flexDirection: "row", width: "auto" }}>
                    <SkeletonPlaceholder.Item height={100} width={100} borderRadius={15} />
                    <View style={{ padding: 7, gap: 5 }}>
                        <SkeletonPlaceholder.Item height={text_height} width={50} borderRadius={5} />
                        <SkeletonPlaceholder.Item height={text_height} width={100} borderRadius={5} />
                        <SkeletonPlaceholder.Item height={text_height * 2} width={200} borderRadius={5} />
                    </View>
                </View>
            </SkeletonPlaceholder>
            <SkeletonPlaceholder backgroundColor={theme.colors.backdrop}>
                <View style={{ paddingRight: 10, flexDirection: "row", gap: 5, justifyContent: "flex-end" }}>
                    <SkeletonPlaceholder.Item height={text_height * 2} width={90} borderRadius={5} />
                    <SkeletonPlaceholder.Item height={text_height * 2} width={90} borderRadius={5} />
                    <SkeletonPlaceholder.Item height={text_height * 2} width={90} borderRadius={5} />
                </View>
            </SkeletonPlaceholder>
        </Surface>
    )
}
