import { Video } from "expo-av"
import { createContext, useEffect, useRef, useState } from "react"
import React from "react"
import * as ScreenOrientation from "expo-screen-orientation"
import { BackHandler, LayoutAnimation } from "react-native"

interface VideoPlayerContextValue {
    ref: React.RefObject<Video>
    showHeader: boolean
    showAppBar: boolean
    toggleFullscreen: () => void
    setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>
    isFullscreen: boolean
}

interface VideoPlayerProviderProps {
    children: React.ReactNode
}

const VideoPlayerContext = createContext<VideoPlayerContextValue>({} as VideoPlayerContextValue)

export default VideoPlayerContext

export const VideoPlayerProvider: React.FC<VideoPlayerProviderProps> = ({ children }) => {
    const ref = useRef<Video>(null)

    const [isFullscreen, setIsFullscreen] = useState(false)
    const [showHeader, setShowHeader] = useState(!isFullscreen)
    const [showAppBar, setShowAppBar] = useState(!isFullscreen)
    const [_, reRender] = useState({})

    const toggleFullscreen = () => {
        setIsFullscreen((value) => !value)
    }

    useEffect(() => {
        setShowHeader((value) => !isFullscreen)
        setShowAppBar((value) => !isFullscreen)
        ScreenOrientation.lockAsync(!isFullscreen ? ScreenOrientation.OrientationLock.PORTRAIT : ScreenOrientation.OrientationLock.LANDSCAPE)
        setTimeout(() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
            reRender({})
        }, 500)

        if (isFullscreen) {
            const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
                setIsFullscreen(false)
                return true
            })

            return () => {
                backHandler.remove()
            }
        }
    }, [isFullscreen])

    return (
        <VideoPlayerContext.Provider value={{ ref, showHeader, showAppBar, toggleFullscreen, isFullscreen, setIsFullscreen }}>
            {children}
        </VideoPlayerContext.Provider>
    )
}
