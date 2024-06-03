import { AVPlaybackStatusSuccess } from "expo-av"
import React, { useEffect, useRef, useState } from "react"
import { Animated, Dimensions, TouchableWithoutFeedback, View } from "react-native"
import { useVideoPlayer } from "../../hooks/useVideoplayer"
import { IconButton, Menu, Text, TouchableRipple, useTheme } from "react-native-paper"
import { VideoProgressBar } from "./VideoProgressBar"
import { PlayPause } from "./PlayPause"
import { LinearGradient } from "expo-linear-gradient"
import { VolumeControls } from "./VolumeControls"
import { Course } from "../../types/server/class/Course"
import { useUser } from "../../hooks/useUser"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { Lesson } from "../../types/server/class/Course/Lesson"
import * as VideoThumbnails from "expo-video-thumbnails"
import Clipboard from "@react-native-clipboard/clipboard"
import { urlGenerator } from "../../tools/urlGenerator"
import * as Sharing from "expo-sharing"
import { Share } from "react-native"

interface ControlsContainerProps {
    status: AVPlaybackStatusSuccess
    course?: Course
    lesson?: Lesson
    initialPosition?: number
}

const ShareButton: React.FC<{ text: string; onPress: () => void }> = ({ text, onPress }) => {
    const theme = useTheme()
    return (
        <TouchableRipple borderless style={{ padding: 5 }} onPress={onPress}>
            <Text style={{ color: theme.colors.secondary }}>{text}</Text>
        </TouchableRipple>
    )
}

export const ControlsContainer: React.FC<ControlsContainerProps> = ({ status, course, lesson, initialPosition }) => {
    const navigation = useNavigation<NavigationProp<any, any>>()
    const { user } = useUser()
    const { ref, toggleFullscreen, isFullscreen } = useVideoPlayer()
    const opacity = useRef(new Animated.Value(1)).current
    const timeoutRef = useRef<NodeJS.Timeout>()
    const theme = useTheme()

    const [playing, setPlaying] = useState(false)
    const [shareModal, setShareModal] = useState(false)
    const [showingControls, setShowingControls] = useState(true)
    const [loading, setLoading] = useState(false)

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
        console.log("asdasd")
        fadeControls(1, 300)
        if (status?.isPlaying) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
            timeoutRef.current = setTimeout(() => fadeControls(0, 300), 3000)
        }
    }

    const handleFullscreenPress = async () => {
        // await ref.current?.presentFullscreenPlayer()
        toggleFullscreen()
    }

    const onShareToChat = async () => {
        if (!lesson) return
        setLoading(true)
        setShareModal(false)
        const { uri } = await VideoThumbnails.getThumbnailAsync(lesson.media.url, { time: status.positionMillis })
        setLoading(false)
        navigation.navigate("course:chat", { course, sharingLesson: { lesson, timestamp: status.positionMillis, thumb: uri, course } })
    }

    const onLinkCopy = () => {
        const url = urlGenerator.lesson(lesson?.id)
        Clipboard.setString(url)
        setShareModal(false)
    }

    const onShare = async () => {
        const url = urlGenerator.lesson(lesson?.id)
        await Share.share({ message: url, url, title: "Compartilhar lição" })
        setShareModal(false)
    }

    useEffect(() => {
        const setupFadeOut = () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
            timeoutRef.current = setTimeout(() => {
                if (playing) fadeControls(0, 300)
            }, 2000)
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

    useEffect(() => {
        if (initialPosition) {
            ref.current?.setPositionAsync(initialPosition)
        }
    }, [initialPosition])

    return (
        <TouchableWithoutFeedback onPress={handleContainerPress}>
            <Animated.View
                style={{ position: "absolute", width: "100%", height: "100%", opacity }}
                pointerEvents={showingControls ? "auto" : "box-only"}
            >
                <LinearGradient
                    style={[
                        {
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            borderRadius: 15,
                        },
                        isFullscreen && { width: Dimensions.get("screen").width + 1, marginLeft: -21, borderRadius: 0 },
                    ]}
                    colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 1)"]}
                    // locations={[0, 0.5]}
                    start={{ x: 0.5, y: 0.5 }}
                />
                <View
                    style={[
                        {
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "row",
                        },
                        isFullscreen && { gap: 20 },
                    ]}
                >
                    <IconButton icon="rewind-10" iconColor={theme.colors.background} size={35} onPress={() => handleTimeChange(-10)} />
                    <PlayPause
                        onPress={handleContainerPress}
                        playing={playing}
                        setPlaying={setPlaying}
                        status={status}
                        size={isFullscreen ? 100 : undefined}
                        loading={loading}
                    />
                    <IconButton icon="fast-forward-10" iconColor={theme.colors.background} size={35} onPress={() => handleTimeChange(10)} />
                </View>

                <View style={[{ height: 65, marginTop: "auto" }, isFullscreen && { marginBottom: 10 }]}>
                    <VideoProgressBar status={status} onContainerPress={handleContainerPress} />
                    <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                        <PlayPause onPress={handleContainerPress} playing={playing} setPlaying={setPlaying} status={status} size={30} />
                        <VolumeControls status={status} onContainerPress={handleContainerPress} />

                        <View style={{ flexDirection: "row", marginLeft: "auto", alignItems: "center" }}>
                            <Menu
                                anchor={
                                    <IconButton
                                        icon="share-variant"
                                        style={{ margin: 0 }}
                                        size={25}
                                        iconColor={theme.colors.background}
                                        onPress={() => setShareModal(true)}
                                    />
                                }
                                visible={shareModal}
                                onDismiss={() => setShareModal(false)}
                                contentStyle={{
                                    backgroundColor: theme.colors.primary,
                                    borderRadius: 15,
                                    position: "relative",
                                    height: 135,
                                    width: 200,
                                    padding: 10,
                                }}
                                style={{ marginTop: -120, marginLeft: 35 }}
                                anchorPosition="top"
                            >
                                <ShareButton text="Compartilhar" onPress={onShare} />
                                {course?.favorited_by.find((item) => item.id == user?.id) && (
                                    <ShareButton text="Compartilhe via chat" onPress={onShareToChat} />
                                )}
                                <ShareButton text="Copiar link" onPress={onLinkCopy} />
                                <IconButton
                                    icon={"close-circle-outline"}
                                    size={20}
                                    iconColor={theme.colors.secondary}
                                    style={{ position: "absolute", right: 0, top: 0 }}
                                    onPress={() => setShareModal(false)}
                                />
                            </Menu>
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
