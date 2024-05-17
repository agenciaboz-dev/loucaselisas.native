import React, { useCallback, useEffect, useRef, useState } from "react"
import { Animated, Dimensions, ImageStyle, TouchableWithoutFeedback, View, ViewStyle } from "react-native"
import { useVideoPlayer } from "../../hooks/useVideoplayer"
import { AVPlaybackStatus, AVPlaybackStatusError, AVPlaybackStatusSuccess, ResizeMode, Video } from "expo-av"
import { IconButton, useTheme } from "react-native-paper"
import { VideoProgressBar } from "./VideoProgressBar"
import { ControlsContainer } from "./ControlsContainer"
import { useFocusEffect } from "@react-navigation/native"

interface VideoPlayerProps {
    source: string
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ source }) => {
    const { ref, isFullscreen, setIsFullscreen } = useVideoPlayer()
    const image_width = Dimensions.get("screen").width * 0.9
    const max_image_height = (image_width / 16) * 9
    const media_style: ViewStyle = { width: image_width, height: max_image_height, borderRadius: 15 }
    const fullscreenStyle: ViewStyle = {
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height * 0.95,
        marginLeft: -21,
        marginTop: -21,
    }

    const [status, setStatus] = useState<AVPlaybackStatusSuccess>()
    const [videoError, setVideoError] = useState<AVPlaybackStatusError>()

    useFocusEffect(
        useCallback(() => {
            return () => {
                if (isFullscreen) setIsFullscreen(false)
            }
        }, [])
    )

    return (
        <View style={{ flex: 1, position: "relative" }}>
            <Video
                ref={ref}
                source={{ uri: source }}
                resizeMode={ResizeMode.COVER}
                style={isFullscreen ? fullscreenStyle : media_style}
                onError={(error) => console.log(`error loading video: ${error}`)}
                onPlaybackStatusUpdate={(status) => (status.isLoaded ? setStatus(status) : setVideoError(status))}
            />
            {status && <ControlsContainer status={status} />}
        </View>
    )
}
