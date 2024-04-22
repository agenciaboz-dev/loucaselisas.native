import React from "react"
import { View } from "react-native"
import { useTheme } from "react-native-paper"
import SkeletonPlaceholder from "react-native-skeleton-placeholder"

interface StatisticsSkeletonsProps {}

export const StatisticsSkeletons: React.FC<StatisticsSkeletonsProps> = ({}) => {
    const theme = useTheme()
    const height = 90
    const borderRadius = 15

    return (
        <SkeletonPlaceholder backgroundColor={theme.colors.backdrop}>
            <SkeletonPlaceholder.Item gap={10}>
                <SkeletonPlaceholder.Item flexDirection="row" gap={10}>
                    <SkeletonPlaceholder.Item borderRadius={borderRadius} flex={1} height={height} />
                    <SkeletonPlaceholder.Item borderRadius={borderRadius} flex={1} height={height} />
                </SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item flexDirection="row" gap={10}>
                    <SkeletonPlaceholder.Item borderRadius={borderRadius} flex={1} height={height} />
                    <SkeletonPlaceholder.Item borderRadius={borderRadius} flex={1} height={height} />
                </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
    )
}
