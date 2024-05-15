import React, { useEffect, useRef, useState } from "react"
import { Animated, Dimensions, ImageStyle, TouchableWithoutFeedback, View } from "react-native"
import { useVideoPlayer } from "../../hooks/useVideoplayer"
import { AVPlaybackStatus, AVPlaybackStatusError, AVPlaybackStatusSuccess, ResizeMode, Video } from "expo-av"
import { IconButton, useTheme } from "react-native-paper"
import { VideoProgressBar } from "./VideoProgressBar"
import { ControlsContainer } from "./ControlsContainer"

interface VideoPlayerProps {
    source: string
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ source }) => {
    const { ref } = useVideoPlayer()
    const image_width = Dimensions.get("screen").width * 0.9
    const max_image_height = (image_width / 16) * 9
    const media_style: ImageStyle = { width: image_width, height: max_image_height, borderRadius: 15 }

    const [status, setStatus] = useState<AVPlaybackStatusSuccess>()
    const [videoError, setVideoError] = useState<AVPlaybackStatusError>()

    return (
        <View style={{ flex: 1, position: "relative" }}>
            <Video
                ref={ref}
                source={{ uri: source }}
                resizeMode={ResizeMode.COVER}
                style={media_style}
                onError={(error) => console.log(`error loading video: ${error}`)}
                onPlaybackStatusUpdate={(status) => (status.isLoaded ? setStatus(status) : setVideoError(status))}
            />
            {status && <ControlsContainer status={status} />}
        </View>
    )
}
