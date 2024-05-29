import { NavigationProp, useNavigation } from "@react-navigation/native"
import React from "react"
import { View } from "react-native"
import { IconButton, Surface, Text } from "react-native-paper"

interface ScreenTitleProps {
    title: string
    hideBackArrow?: boolean
    right?: React.ReactNode
}

export const ScreenTitle: React.FC<ScreenTitleProps> = ({ title, hideBackArrow, right }) => {
    const navigation = useNavigation<NavigationProp<any, any>>()

    return (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                {!hideBackArrow && (
                    <Surface elevation={2} style={{ borderRadius: 100 }}>
                        <IconButton icon={"chevron-left"} onPress={() => navigation.goBack()} style={{ margin: 0 }} />
                    </Surface>
                )}
                <Text variant="titleLarge" style={{ alignSelf: "center", maxWidth: right ? 200 : undefined }} numberOfLines={2}>
                    {title}
                </Text>
            </View>
            {right}
        </View>
    )
}
