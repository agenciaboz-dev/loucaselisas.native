import React, { useEffect, useRef, useState } from "react"
import { Animated, Dimensions, ImageStyle, TouchableWithoutFeedback, View } from "react-native"
import { useVideoPlayer } from "../../hooks/useVideoplayer"
import { AVPlaybackStatus, AVPlaybackStatusError, AVPlaybackStatusSuccess, ResizeMode, Video } from "expo-av"
import { IconButton, useTheme } from "react-native-paper"

interface VideoPlayerProps {
    source: string
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ source }) => {
    const { ref } = useVideoPlayer()
    const theme = useTheme()
    const image_width = Dimensions.get("screen").width * 0.9
    const max_image_height = (image_width / 16) * 9
    const media_style: ImageStyle = { width: image_width, height: max_image_height, borderRadius: 15 }

    const opacity = new Animated.Value(1)
    const timeoutRef = useRef<NodeJS.Timeout>()

    const [status, setStatus] = useState<AVPlaybackStatusSuccess>()
    const [videoError, setVideoError] = useState<AVPlaybackStatusError>()
    const [playing, setPlaying] = useState(false)

    const resetFadeout = (timer = 3000) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => fadeControls(0, 300), timer)
        console.log("resetting timeout")
    }

    const togglePlayPause = async () => {
        if (status?.isPlaying) {
            setPlaying(false)
            await ref.current?.pauseAsync()
        } else {
            if (status?.positionMillis == status?.durationMillis) {
                await ref.current?.setPositionAsync(0)
            }
            setPlaying(true)
            await ref.current?.playAsync()
        }
        handleContainerPress()
    }

    const handleTimeChange = async (value: number) => {
        const position = status?.positionMillis
        const duration = status?.durationMillis
        if (!position || !ref.current || !duration) return

        let new_position = position + value * 1000
        if (new_position < 0) new_position = 0
        if (new_position > duration) new_position = duration

        await ref.current.setPositionAsync(new_position)
        handleContainerPress()
    }

    const fadeControls = (toValue: number, duration: number) => {
        console.log({ toValue, duration })
        Animated.timing(opacity, {
            toValue,
            duration,
            useNativeDriver: true,
        }).start(() => {
            if (toValue === 1) {
                resetFadeout()
            }
        })
    }

    const handleContainerPress = () => {
        fadeControls(1, 300)
    }

    useEffect(() => {
        // console.log(status)
    }, [status])

    return (
        <TouchableWithoutFeedback onPress={handleContainerPress}>
            <View style={{ flex: 1, position: "relative" }}>
                <Video
                    ref={ref}
                    source={{ uri: source }}
                    resizeMode={ResizeMode.COVER}
                    style={media_style}
                    onError={(error) => console.log(`error loading video: ${error}`)}
                    onPlaybackStatusUpdate={(status) => (status.isLoaded ? setStatus(status) : setVideoError(status))}
                />
                <Animated.View style={{ position: "absolute", width: "100%", height: "100%", opacity }}>
                    <View
                        style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "row",
                        }}
                    >
                        <IconButton icon="rewind-10" iconColor={theme.colors.background} size={40} onPress={() => handleTimeChange(-10)} />
                        <IconButton
                            icon={playing ? "pause-circle-outline" : "play-circle-outline"}
                            iconColor={theme.colors.background}
                            size={60}
                            onPress={togglePlayPause}
                        />
                        <IconButton icon="fast-forward-10" iconColor={theme.colors.background} size={40} onPress={() => handleTimeChange(10)} />
                    </View>
                </Animated.View>
            </View>
        </TouchableWithoutFeedback>
    )
}
