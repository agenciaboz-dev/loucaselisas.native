import { AVPlaybackStatusSuccess, Video } from "expo-av"
import React, { useEffect, useRef, useState } from "react"
import { View } from "react-native"
import { Slider } from "@miblanchard/react-native-slider"
import { useVideoPlayer } from "../../hooks/useVideoplayer"
import { Text, useTheme } from "react-native-paper"
import moment from "moment"
import "moment-duration-format"

interface VideoProgressBarProps {
    status: AVPlaybackStatusSuccess
    onContainerPress: () => void
}

export const VideoProgressBar: React.FC<VideoProgressBarProps> = ({ status, onContainerPress }) => {
    const { ref, isFullscreen } = useVideoPlayer()
    const theme = useTheme()
    const intervalRef = useRef<NodeJS.Timeout>()

    const [value, setValue] = useState(status.positionMillis)

    const handleSlideStart = () => {
        intervalRef.current = setInterval(() => onContainerPress(), 1000)
    }

    const handleSlideFinish = async (value: number) => {
        ref.current?.setPositionAsync(value)

        if (intervalRef.current) clearInterval(intervalRef.current)
    }

    useEffect(() => {
        setValue(status.positionMillis)
    }, [status.positionMillis])

    return (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 10 }}>
            <Text style={[{ color: theme.colors.background, flex: 0.11, textAlign: "center" }, isFullscreen && { flex: 0.06 }]}>
                {/* @ts-ignore */}
                {moment.duration(value).format("mm:ss", { trim: false })}
            </Text>
            <Slider
                value={value}
                onValueChange={(value) => setValue(value[0])}
                onSlidingStart={handleSlideStart}
                onSlidingComplete={(value) => handleSlideFinish(value[0])}
                maximumValue={status.durationMillis}
                minimumValue={0}
                containerStyle={{ flex: isFullscreen ? 0.95 : 0.78, height: 20 }}
                trackStyle={{ backgroundColor: theme.colors.background, borderRadius: 100 }}
                thumbStyle={{ backgroundColor: theme.colors.outlineVariant, width: 15, height: 15 }}
                minimumTrackStyle={{ backgroundColor: theme.colors.outlineVariant, borderRadius: 100 }}
                step={1}
            />
            <Text style={[{ color: theme.colors.background, flex: 0.11, textAlign: "center" }, isFullscreen && { flex: 0.06 }]}>
                {/* @ts-ignore */}
                {moment.duration(status.durationMillis).format("mm:ss", { trim: false })}
            </Text>
        </View>
    )
}
