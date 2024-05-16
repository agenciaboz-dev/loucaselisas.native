import { AVPlaybackStatusSuccess } from "expo-av"
import React, { useState } from "react"
import { View } from "react-native"
import { IconButton, useTheme } from "react-native-paper"
import { useVideoPlayer } from "../../hooks/useVideoplayer"

interface VolumeControlsProps {
    status: AVPlaybackStatusSuccess
    onContainerPress: () => void
}

export const VolumeControls: React.FC<VolumeControlsProps> = ({ status, onContainerPress }) => {
    const { ref } = useVideoPlayer()
    const theme = useTheme()

    const handleIconPress = async () => {
        await ref.current?.setIsMutedAsync(!status.isMuted)
        onContainerPress()
    }

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
