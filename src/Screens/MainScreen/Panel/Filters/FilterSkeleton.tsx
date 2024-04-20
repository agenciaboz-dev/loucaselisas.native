import { useArray } from "burgos-array"
import React from "react"
import { Surface, useTheme } from "react-native-paper"
import SkeletonPlaceholder from "react-native-skeleton-placeholder"

interface FilterSkeletonProps {
    quantity: number
}

export const FilterSkeleton: React.FC<FilterSkeletonProps> = ({ quantity }) => {
    const theme = useTheme()
    const skeletons = useArray().newArray(quantity)
    const borderRadius = 20

    return (
        <SkeletonPlaceholder backgroundColor={theme.colors.backdrop}>
            <SkeletonPlaceholder.Item flexDirection="row" gap={5}>
                {skeletons.map((index) => (
                    <Surface key={index} style={{ borderRadius: borderRadius }}>
                        <SkeletonPlaceholder.Item borderRadius={borderRadius} width={110} height={42} />
                    </Surface>
                ))}
            </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
    )
}
