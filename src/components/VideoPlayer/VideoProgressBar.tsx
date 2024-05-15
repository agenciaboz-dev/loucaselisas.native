import { AVPlaybackStatusSuccess, Video } from "expo-av"
import React, { useEffect, useState } from "react"
import { View } from "react-native"
import { Slider } from "@miblanchard/react-native-slider"
import { useVideoPlayer } from "../../hooks/useVideoplayer"
import { Text, useTheme } from "react-native-paper"
import moment from "moment"
import "moment-duration-format"

interface VideoProgressBarProps {
    status: AVPlaybackStatusSuccess
}

export const VideoProgressBar: React.FC<VideoProgressBarProps> = ({ status }) => {
    const { ref } = useVideoPlayer()
    const theme = useTheme()

    const [value, setValue] = useState(status.positionMillis)

    useEffect(() => {
        setValue(status.positionMillis)
    }, [status.positionMillis])

    return (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Text style={{ color: theme.colors.background, flex: 0.11, textAlign: "center" }}>
                {moment.duration(value).format("mm:ss", { trim: false })}
            </Text>
            <Slider
                value={value}
                onValueChange={(value) => setValue(value[0])}
                onSlidingComplete={(value) => ref.current?.setPositionAsync(value[0])}
                maximumValue={status.durationMillis}
                minimumValue={0}
                containerStyle={{ flex: 0.78 }}
                trackStyle={{ backgroundColor: theme.colors.background, borderRadius: 100, height: 6 }}
                thumbStyle={{ backgroundColor: theme.colors.primary, width: 15, height: 15 }}
                minimumTrackStyle={{ backgroundColor: theme.colors.primary }}
                step={1}
            />
            <Text style={{ color: theme.colors.background, flex: 0.11, textAlign: "center" }}>
                {moment.duration(status.durationMillis).format("mm:ss", { trim: false })}
            </Text>
        </View>
    )
}
