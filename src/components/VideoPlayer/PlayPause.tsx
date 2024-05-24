import React from "react"
import { IconButton, useTheme } from "react-native-paper"
import { useVideoPlayer } from "../../hooks/useVideoplayer"
import { AVPlaybackStatusSuccess } from "expo-av"

interface PlayPauseProps {
    onPress: () => void
    playing: boolean
    setPlaying: React.Dispatch<React.SetStateAction<boolean>>
    status: AVPlaybackStatusSuccess
}

export const PlayPause: React.FC<PlayPauseProps> = ({ onPress, playing, setPlaying, status }) => {
    const { ref } = useVideoPlayer()
    const theme = useTheme()

    const togglePlayPause = async () => {
        setPlaying(!status?.isPlaying)
        if (status?.isPlaying) {
            await ref.current?.pauseAsync()
        } else {
            if (status?.positionMillis == status?.durationMillis) {
                await ref.current?.setPositionAsync(0)
            }
            await ref.current?.playAsync()
        }
        onPress()
    }

    return (
        <IconButton
            icon={playing ? "pause-circle-outline" : "play-circle-outline"}
            iconColor={theme.colors.background}
            size={60}
            onPress={togglePlayPause}
        />
    )
}
