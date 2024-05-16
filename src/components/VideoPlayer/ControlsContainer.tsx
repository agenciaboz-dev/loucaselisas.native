import { AVPlaybackStatusSuccess } from "expo-av"
import React, { useEffect, useRef, useState } from "react"
import { Animated, TouchableWithoutFeedback, View } from "react-native"
import { useVideoPlayer } from "../../hooks/useVideoplayer"
import { IconButton, useTheme } from "react-native-paper"
import { VideoProgressBar } from "./VideoProgressBar"
import { PlayPause } from "./PlayPause"
import { LinearGradient } from "expo-linear-gradient"
import { VolumeControls } from "./VolumeControls"

interface ControlsContainerProps {
    status: AVPlaybackStatusSuccess
}

export const ControlsContainer: React.FC<ControlsContainerProps> = ({ status }) => {
    const { ref } = useVideoPlayer()
    const opacity = useRef(new Animated.Value(1)).current
    const timeoutRef = useRef<NodeJS.Timeout>()
    const theme = useTheme()

    const [playing, setPlaying] = useState(false)
    const [showingControls, setShowingControls] = useState(true)

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
        Animated.timing(opacity, {
            toValue,
            duration,
            useNativeDriver: true,
        }).start(() => {
            setShowingControls(!!toValue)
        })
    }

    const handleContainerPress = () => {
        fadeControls(1, 300)
        if (status?.isPlaying) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
            timeoutRef.current = setTimeout(() => fadeControls(0, 300), 2000)
        }
    }

    const handleFullscreenPress = async () => {
        await ref.current?.presentFullscreenPlayer()
    }

    useEffect(() => {
        const setupFadeOut = () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
            timeoutRef.current = setTimeout(() => {
                if (playing) fadeControls(0, 300)
            }, 1000)
        }

        if (status?.isPlaying) {
            setupFadeOut()
        } else {
            fadeControls(1, 300)
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [playing, status?.isPlaying])

    useEffect(() => {
        if (status) {
            if (status.positionMillis === status.durationMillis) {
                setPlaying(false)
            }
        }
    }, [status?.positionMillis])

    return (
        <TouchableWithoutFeedback onPress={handleContainerPress}>
            <Animated.View
                style={{ position: "absolute", width: "100%", height: "100%", opacity }}
                pointerEvents={showingControls ? undefined : "box-only"}
            >
                <LinearGradient
                    style={{ position: "absolute", width: "100%", height: "100%", borderRadius: 15 }}
                    colors={["rgba(0, 0, 0, 0)", "rgba(50, 50, 50, 1)"]}
                    // locations={[0, 0.5]}
                    start={{ x: 0.5, y: 0.5 }}
                />
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
                    <PlayPause onPress={handleContainerPress} playing={playing} setPlaying={setPlaying} status={status} />
                    <IconButton icon="fast-forward-10" iconColor={theme.colors.background} size={40} onPress={() => handleTimeChange(10)} />
                </View>
                <View style={{ height: 65, marginTop: "auto" }}>
                    <VideoProgressBar status={status} onContainerPress={handleContainerPress} />
                    <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                        <PlayPause onPress={handleContainerPress} playing={playing} setPlaying={setPlaying} status={status} size={30} />
                        <VolumeControls status={status} onContainerPress={handleContainerPress} />

                        <View style={{ flexDirection: "row", marginLeft: "auto", alignItems: "center" }}>
                            <IconButton icon="share-variant" style={{ margin: 0 }} size={25} iconColor={theme.colors.background} />
                            <IconButton
                                icon="fullscreen"
                                style={{ margin: 0 }}
                                size={30}
                                iconColor={theme.colors.background}
                                onPress={handleFullscreenPress}
                            />
                        </View>
                    </View>
                </View>
            </Animated.View>
        </TouchableWithoutFeedback>
    )
}
