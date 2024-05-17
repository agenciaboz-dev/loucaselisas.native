import { Video } from "expo-av"
import { createContext, useRef, useState } from "react"
import React from "react"
import * as ScreenOrientation from "expo-screen-orientation"

interface VideoPlayerContextValue {
    ref: React.RefObject<Video>
    showHeader: boolean
    showAppBar: boolean
    toggleFullscreen: () => void
}

interface VideoPlayerProviderProps {
    children: React.ReactNode
}

const VideoPlayerContext = createContext<VideoPlayerContextValue>({} as VideoPlayerContextValue)

export default VideoPlayerContext

export const VideoPlayerProvider: React.FC<VideoPlayerProviderProps> = ({ children }) => {
    const ref = useRef<Video>(null)

    const [showHeader, setShowHeader] = useState(true)
    const [showAppBar, setShowAppBar] = useState(true)

    const toggleFullscreen = () => {
        setShowHeader((value) => !value)
        setShowAppBar((value) => !value)
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
    }

    return <VideoPlayerContext.Provider value={{ ref, showHeader, showAppBar, toggleFullscreen }}>{children}</VideoPlayerContext.Provider>
}
