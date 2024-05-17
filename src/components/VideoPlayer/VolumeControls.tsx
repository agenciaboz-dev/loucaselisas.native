import { AVPlaybackStatusSuccess } from "expo-av"
import React, { useEffect, useRef, useState } from "react"
import { View } from "react-native"
import { IconButton, useTheme } from "react-native-paper"
import { useVideoPlayer } from "../../hooks/useVideoplayer"
import { Slider } from "@miblanchard/react-native-slider"

interface VolumeControlsProps {
    status: AVPlaybackStatusSuccess
    onContainerPress: () => void
}

export const VolumeControls: React.FC<VolumeControlsProps> = ({ status, onContainerPress }) => {
    const { ref, isFullscreen } = useVideoPlayer()
    const theme = useTheme()
    const intervalRef = useRef<NodeJS.Timeout>()

    const [volume, setVolume] = useState(status.volume)

    const handleIconPress = async () => {
        await ref.current?.setIsMutedAsync(!status.isMuted)
        onContainerPress()
    }

    const handleStartVolumeSlide = () => {
        intervalRef.current = setInterval(() => onContainerPress(), 1000)
    }

    const handleFinishVolumeSlide = async (value: number) => {
        ref.current?.setVolumeAsync(value)

        if (intervalRef.current) clearInterval(intervalRef.current)
    }

    return (
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <IconButton
                onPress={handleIconPress}
                icon={status.isMuted ? "volume-mute" : "volume-high"}
                style={{ margin: 0 }}
                iconColor={theme.colors.background}
            />
            <Slider
                value={volume}
                onValueChange={(value) => setVolume(value[0])}
                onSlidingComplete={(value) => handleFinishVolumeSlide(value[0])}
                onSlidingStart={handleStartVolumeSlide}
                maximumValue={1}
                minimumValue={0}
                containerStyle={{ width: isFullscreen ? 160 : 80, height: 20 }}
                trackStyle={{ backgroundColor: theme.colors.background, borderRadius: 100 }}
                thumbStyle={{ backgroundColor: theme.colors.outlineVariant, width: 15, height: 15 }}
                minimumTrackStyle={{ backgroundColor: theme.colors.outlineVariant, borderRadius: 100 }}
            />
        </View>
    )
}
