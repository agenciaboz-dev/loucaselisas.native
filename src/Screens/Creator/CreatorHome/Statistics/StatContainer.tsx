import numeral from "numeral"
import React from "react"
import { View } from "react-native"
import { Surface, Text, useTheme } from "react-native-paper"
import SkeletonPlaceholder from "react-native-skeleton-placeholder"

interface StatContainerProps {
    title: string
    value?: number
    skeleton?: boolean
}

export const StatContainer: React.FC<StatContainerProps> = ({ title, value, skeleton }) => {
    const theme = useTheme()

    return (
        <Surface style={{ flex: 1, borderRadius: 15, padding: 10, justifyContent: "center", alignItems: "center" }}>
            {skeleton ? (
                <View style={{ justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
                    <SkeletonPlaceholder backgroundColor={theme.colors.backdrop}>
                        <SkeletonPlaceholder.Item width={60} height={45} borderRadius={10} />
                    </SkeletonPlaceholder>
                </View>
            ) : (
                <Text variant="displayMedium" style={{ color: theme.colors.tertiary }}>
                    {numeral(value).format("0.[00]a").toUpperCase()}
                </Text>
            )}
            <Text>{title}</Text>
        </Surface>
    )
}
