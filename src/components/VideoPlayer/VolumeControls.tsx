import { AVPlaybackStatusSuccess } from "expo-av"
import React from "react"
import { View } from "react-native"
import { IconButton, useTheme } from "react-native-paper"

interface VolumeControlsProps {
    status: AVPlaybackStatusSuccess
}

export const VolumeControls: React.FC<VolumeControlsProps> = ({ status }) => {
    const theme = useTheme()

    const handleIconPress = async () => {}

    return (
        <View style={{ flexDirection: "row" }}>
            <IconButton
                onPress={handleIconPress}
                icon={status.isMuted ? "volume-mute" : "volume-high"}
                style={{ margin: 0 }}
                iconColor={theme.colors.background}
            />
        </View>
    )
}
