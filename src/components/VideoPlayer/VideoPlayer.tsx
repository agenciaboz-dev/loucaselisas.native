import React from "react"
import { Dimensions, ImageStyle, View } from "react-native"
import { useVideo } from "../../hooks/useVideo"
import { IconButton, useTheme } from "react-native-paper"
import { VideoView, useVideoPlayer } from "expo-video"

interface VideoPlayerProps {
    source: string
}

export const VideoPlayer: React.FC<VideoPlayerProps> = (props) => {
    const { videoRef } = useVideo()
    const player = useVideoPlayer(props.source, (player) => {
        player.loop = false
    })
    const theme = useTheme()
    const image_width = Dimensions.get("screen").width * 0.9
    const max_image_height = (image_width / 16) * 9
    const media_style: ImageStyle = { width: image_width, height: max_image_height, borderRadius: 15 }

    return (
        <View style={{ flex: 1, position: "relative" }}>
            <VideoView player={player} style={media_style} />
            <View style={{ position: "absolute", width: "100%", height: "100%" }}>
                <View style={{ position: "absolute", width: "100%", height: "100%", justifyContent: "center", alignItems: "center", gap: 30 }}>
                    <IconButton icon={"pause-circle-outline"} size={60} iconColor={theme.colors.background} />
                </View>
                <View style={{ height: 60 }}></View>
            </View>
        </View>
    )
}
