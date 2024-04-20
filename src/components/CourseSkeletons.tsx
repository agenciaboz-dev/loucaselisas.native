import { useArray } from "burgos-array"
import React from "react"
import { View } from "react-native"
import { Surface, useTheme } from "react-native-paper"
import SkeletonPlaceholder from "react-native-skeleton-placeholder"

interface CourseSkeletonsProps {
    quantity?: number
}

export const CourseSkeletons: React.FC<CourseSkeletonsProps> = ({ quantity = 3 }) => {
    const array = useArray().newArray(quantity)
    const theme = useTheme()

    return (
        <SkeletonPlaceholder borderRadius={15} backgroundColor={theme.colors.backdrop}>
            <Surface style={{ borderRadius: 15 }}>
                <SkeletonPlaceholder.Item flexDirection="row" gap={10}>
                    {array.map((index) => (
                        <SkeletonPlaceholder.Item key={index} width={175} height={175} />
                    ))}
                </SkeletonPlaceholder.Item>
            </Surface>
        </SkeletonPlaceholder>
    )
}
