import React from "react"
import { View } from "react-native"
import { Course } from "../../../../types/server/class/Course"
import { Surface, Text, TouchableRipple, useTheme } from "react-native-paper"
import { Image } from "expo-image"
import { StatData } from "./StatData"

interface StatsCardContainerProps {
    name: string
    image: string
    views: number
    likes: number
    messages?: number
    downloads?: number
    alt_text?: string
    onPress: () => void
}

export const StatsCardContainer: React.FC<StatsCardContainerProps> = (props) => {
    const theme = useTheme()
    return (
        <Surface style={{ borderRadius: 15 }}>
            <TouchableRipple borderless style={{ borderRadius: 15, padding: 10, flexDirection: "row", gap: 10 }} onPress={props.onPress}>
                <>
                    <Image source={props.image} style={{ width: 75, aspectRatio: "1/1", borderRadius: 15 }} contentFit="cover" />
                    <View style={{ flex: 1, paddingHorizontal: 10 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text variant="bodyLarge" style={{ color: theme.colors.backdrop, maxWidth: 200 }} numberOfLines={1}>
                                {props.name}
                            </Text>
                            <Text style={{ color: theme.colors.backdrop, maxWidth: 55 }} numberOfLines={1}>
                                {props.alt_text}
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                alignSelf: "center",
                                width: "100%",
                            }}
                        >
                            <StatData icon="eye-outline" value={props.views} />
                            <StatData icon="heart-outline" value={props.likes} />
                            {props.messages !== undefined ? <StatData icon="comment-text-outline" value={props.messages} /> : null}
                            {props.downloads !== undefined ? <StatData icon="download-outline" value={props.downloads} /> : null}
                        </View>
                    </View>
                </>
            </TouchableRipple>
        </Surface>
    )
}
